import { userPool } from "./user-pool";
// import { appleProviderName } from "./apple-identity-provider"; // Appleプロバイダー名をインポート

// ユーザープールクライアントの作成
export const userPoolClient = new aws.cognito.UserPoolClient("UserPoolClient", {
  userPoolId: userPool.id,
  name: `web-client-${process.env.SST_STAGE || 'dev'}`,
  generateSecret: false,
  explicitAuthFlows: [
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_USER_SRP_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_ADMIN_USER_PASSWORD_AUTH"
  ],
  // codeフローを追加（Appleサインインではimplicitよりcodeフローが推奨）
  allowedOauthFlows: ["implicit", "code"],
  allowedOauthScopes: ["email", "openid", "profile"],
  allowedOauthFlowsUserPoolClient: true,
    // "https://mokokero.com/callback",
    // "http://localhost:3000/callback",
    // // モバイルアプリ用のURLスキームを追加（必要に応じて変更）
    // "mokokero://callback"
  callbackUrls: [
    "https://mokokero.com",
    "http://localhost:3000"
  ],
  logoutUrls: [
    "https://mokokero.com/logout",
    "http://localhost:3000/logout",
    // モバイルアプリ用のURLスキームを追加（必要に応じて変更）
    "mokokero://logout"
  ],
  // Cognitoの組み込み認証とAppleサインインの両方をサポート
  supportedIdentityProviders: ["COGNITO", "SignInWithApple"]
  // supportedIdentityProviders: ["COGNITO"]
});

// クライアントIDをエクスポート
export const userPoolClientId = userPoolClient.id;
