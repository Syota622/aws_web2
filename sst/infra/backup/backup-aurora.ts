// Auroraデータベースのバックアップ設定（東京リージョンのプライマリバックアップと大阪リージョンへのコピー）
import { osakaProvider } from "../providers"; // プロバイダーをインポート
import { rdsResources } from "../aurora";
// 東京リージョンにAuroraバックアップボールトを作成
const tokyoAuroraBackupVault = new aws.backup.Vault("TokyoAuroraBackupVault", {
  name: `tokyo-aurora-vault-${process.env.SST_STAGE || 'dev'}`
  // デフォルトのプロバイダー（東京リージョン）を使用
});

// 大阪リージョンにAuroraバックアップボールトを作成
const osakaAuroraBackupVault = new aws.backup.Vault("OsakaAuroraBackupVault", {
  name: `osaka-aurora-vault-${process.env.SST_STAGE || 'dev'}`
}, { provider: osakaProvider });

// バックアップ用のIAMロールを作成（既存のロールを使用できる場合は省略可能）
const auroraBackupRole = new aws.iam.Role("AuroraBackupRole", {
  name: `aurora-backup-role-${process.env.SST_STAGE || 'dev'}`,
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

// Aurora用のバックアッププランを作成（1時間ごとのバックアップと大阪リージョンへのコピー）
const auroraBackupPlan = new aws.backup.Plan("AuroraBackupPlan", {
  name: `aurora-backup-plan-${process.env.SST_STAGE || 'dev'}`,
  rules: [{
    ruleName: `aurora-hourly-backup-${process.env.SST_STAGE || 'dev'}`,
    targetVaultName: tokyoAuroraBackupVault.name,
    // 15時20分に起動
    schedule: "cron(25 15 * * ? *)",
    scheduleExpressionTimezone: "Asia/Tokyo",
    // バックアップウィンドウを設定
    startWindow: 60,          // バックアップを開始するまでの時間（分）
    completionWindow: 120,    // バックアップを完了するまでの時間（分）    
    // RDSとAuroraはバックアップのライフサイクル設定が少し異なる可能性があるので注意
    lifecycle: {
    deleteAfter: 1          // 東京のバックアップは1日間保持
  },
    // 大阪リージョンへのコピーアクション
    copyActions: [{
      destinationVaultArn: osakaAuroraBackupVault.arn,
      lifecycle: {
        deleteAfter: 3        // 大阪リージョンでは3日間保持
      }
    }]
  }]
});

// Auroraクラスターをバックアッププランに含める
// arn:aws:rds:ap-northeast-1:235484765172:cluster:sst-dev-myapppostgrescluster-rzvfhxte
const auroraBackupSelection = new aws.backup.Selection("AuroraBackupSelection", {
  name: `aurora-selection-${process.env.SST_STAGE || 'dev'}`,
  planId: auroraBackupPlan.id,
  resources: [
    rdsResources.postgres.clusterArn
    // "arn:aws:rds:ap-northeast-1:235484765172:cluster:test"
  ],
  iamRoleArn: auroraBackupRole.arn
});

// エクスポート（必要に応じて）
export const tokyoAuroraBackupVaultArn = tokyoAuroraBackupVault.arn;
export const osakaAuroraBackupVaultArn = osakaAuroraBackupVault.arn;
export const auroraBackupPlanArn = auroraBackupPlan.id;
// export const auroraBackupSelectionId = auroraBackupSelection.id;
// export const auroraBackupSelectionTestId = auroraBackupSelectionTest.id;