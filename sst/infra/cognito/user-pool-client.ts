import { userPool } from "./user-pool";

// ユーザープールクライアントの作成
export const userPoolClient = new aws.cognito.UserPoolClient("UserPoolClient", {
  userPoolId: userPool.id,
  name: `web-client-${process.env.SST_STAGE || 'dev'}`,
  generateSecret: false,
  explicitAuthFlows: [
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_USER_SRP_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH"
  ],
  allowedOauthFlows: ["implicit"],
  allowedOauthScopes: ["email", "openid", "profile"],
  allowedOauthFlowsUserPoolClient: true,
  callbackUrls: [
    "https://mokokero.com/callback",
    "http://localhost:3000/callback"
  ],
  supportedIdentityProviders: ["COGNITO"]
});

// クライアントIDをエクスポート
export const userPoolClientId = userPoolClient.id;