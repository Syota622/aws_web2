// 東京リージョン内でのDynamoDBテーブルのバックアップ設定

// 東京リージョンにバックアップボールトを作成
const backupVault = new aws.backup.Vault("DynamoDBBackupVault", {
  name: `dynamodb-backup-vault-${process.env.SST_STAGE || 'dev'}`
});

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

// バックアッププランを作成
// エラーメッセージから、'rules'が必要とわかる
const backupPlan = new aws.backup.Plan("DynamoDBBackupPlan", {
  name: `dynamodb-backup-plan-${process.env.SST_STAGE || 'dev'}`,
  // ここではrulesを配列として提供
  rules: [{
    ruleName: "DailyBackups",
    targetVaultName: backupVault.name,
    schedule: "cron(0 1 * * ? *)",
    // 最小限のプロパティのみ設定
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
export const backupVaultArn = backupVault.arn;
export const backupPlanArn = backupPlan.arn;
export const backupSelectionId = backupSelection.id;