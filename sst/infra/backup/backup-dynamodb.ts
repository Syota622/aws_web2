// 東京リージョン内でのDynamoDBテーブルのバックアップ設定と大阪リージョンへのクロスリージョンバックアップ
import { osakaProvider } from "../providers"; // プロバイダーをインポート

// 東京リージョンにバックアップボールトを作成
const tokyoBackupVault = new aws.backup.Vault("TokyoBackupVault", {
  name: `tokyo-dynamodb-vault-${process.env.SST_STAGE || 'dev'}`
  // デフォルトのプロバイダー（東京リージョン）を使用
});

// 大阪リージョンにバックアップボールトを作成
const osakaBackupVault = new aws.backup.Vault("OsakaBackupVault", {
  name: `osaka-dynamodb-vault-${process.env.SST_STAGE || 'dev'}`
}, { provider: osakaProvider });

// バックアップ用のIAMロールを作成
const backupRole = new aws.iam.Role("BackupRole", {
  name: `dynamodb-backup-role-${process.env.SST_STAGE || 'dev'}`,
  assumeRolePolicy: JSON.stringify({
    Version: "2012-10-17",
    Statement: [{
      Action: "sts:AssumeRole",
      Effect: "Allow",
      Principal: {
        Service: "backup.amazonaws.com"
      }
    }]
  }),
  managedPolicyArns: [
    "arn:aws:iam::aws:policy/service-role/AWSBackupServiceRolePolicyForBackup",
    "arn:aws:iam::aws:policy/service-role/AWSBackupServiceRolePolicyForRestores"
  ]
});

// バックアッププランを作成（東京での1時間ごとのバックアップと大阪へのクロスリージョンコピー）
const backupPlan = new aws.backup.Plan("DynamoDBBackupPlan", {
  name: `dynamodb-backup-plan-${process.env.SST_STAGE || 'dev'}`,
  rules: [{
    ruleName: `dynamodb-sst-hourly-${process.env.SST_STAGE || 'dev'}`,
    targetVaultName: tokyoBackupVault.name,
    // 毎週水曜日の16:40に実行（水曜=4）
    schedule: "cron(40 16 ? * 4 *)",
    scheduleExpressionTimezone: "Asia/Tokyo",
    // バックアップウィンドウを設定
    startWindow: 60,          // バックアップを開始するまでの時間（分）
    completionWindow: 120,    // バックアップを完了するまでの時間（分）    
    lifecycle: {
      deleteAfter: 7            // 東京のバックアップは7日間保持（1世代のみ保持）
    },
    // 大阪リージョンへのコピーアクション - 明示的にリージョンを指定
    copyActions: [{
      destinationVaultArn: osakaBackupVault.arn,
      lifecycle: {
        deleteAfter: 28       // 大阪リージョンでは28日間保持（4世代保持）
      }
    }]
  }]
});

// DynamoDBテーブルをバックアッププランに含める
const backupSelection = new aws.backup.Selection("DynamoDBTableSelection", {
  name: `dynamodb-selection-${process.env.SST_STAGE || 'dev'}`,
  planId: backupPlan.id,
  resources: [
    // 指定されたDynamoDBテーブルのARNを使用
    "arn:aws:dynamodb:ap-northeast-1:235484765172:table/sst-table"
  ],
  iamRoleArn: backupRole.arn
});

// エクスポート（必要に応じて）
export const tokyoBackupVaultArn = tokyoBackupVault.arn;
export const osakaBackupVaultArn = osakaBackupVault.arn;
export const backupPlanArn = backupPlan.id;
export const backupSelectionId = backupSelection.id;