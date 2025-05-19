// Apple認証情報をParameter Storeに保存
const appleClientId = new aws.ssm.Parameter("AppleClientId", {
  name: `/${process.env.SST_STAGE || 'dev'}/auth/apple/client-id`,
  type: "SecureString",
  value: "placeholder-update-me", // プレースホルダー値
  description: "Apple Sign-In Client ID"
});

const appleTeamId = new aws.ssm.Parameter("AppleTeamId", {
  name: `/${process.env.SST_STAGE || 'dev'}/auth/apple/team-id`,
  type: "SecureString",
  value: "placeholder-update-me", // プレースホルダー値
  description: "Apple Developer Team ID"
});

const appleKeyId = new aws.ssm.Parameter("AppleKeyId", {
  name: `/${process.env.SST_STAGE || 'dev'}/auth/apple/key-id`,
  type: "SecureString",
  value: "placeholder-update-me", // プレースホルダー値
  description: "Apple Sign-In Key ID"
});

const applePrivateKey = new aws.ssm.Parameter("ApplePrivateKey", {
  name: `/${process.env.SST_STAGE || 'dev'}/auth/apple/private-key`,
  type: "SecureString",
  value: "placeholder-private-key-update-me", // プレースホルダー値
  description: "Apple Sign-In Private Key"
});

// パラメータストア情報をエクスポート
export const appleConfigParameters = {
  clientIdParam: appleClientId,
  teamIdParam: appleTeamId,
  keyIdParam: appleKeyId,
  privateKeyParam: applePrivateKey
};

// Parameter名をエクスポート（参照しやすくするため）
export const appleParameterNames = {
  clientIdName: appleClientId.name,
  teamIdName: appleTeamId.name,
  keyIdName: appleKeyId.name,
  privateKeyName: applePrivateKey.name
};