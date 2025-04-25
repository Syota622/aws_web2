// infra/cognito.ts

// Cognitoユーザープールの作成
export const userPool = new sst.aws.CognitoUserPool("UserPool", {
  // ユーザープール名に環境変数を付与
  name: `my-app-users-${process.env.SST_STAGE || 'dev'}`,
  
  // メールでのサインインを許可
  signIn: {
    email: true
  },
  
  // 自動確認の設定
  autoVerify: {
    email: true
  },
  
  // パスワードポリシー
  passwordPolicy: {
    minimumLength: 8,
    requireNumbers: true,
    requireSymbols: true,
    requireLowercase: true,
    requireUppercase: true
  },
  
  // 標準属性の設定
  standardAttributes: {
    email: {
      required: true,
      mutable: true
    },
    givenName: {
      required: true,
      mutable: true
    },
    familyName: {
      required: true,
      mutable: true
    }
  },
  
  // カスタム属性の設定
  customAttributes: {
    joinedOn: {
      type: "String",
      mutable: true
    }
  },
  
  // ユーザープールクライアントの設定
  clients: [{
    name: `web-client-${process.env.SST_STAGE || 'dev'}`,
    disableSecretKey: true,
    authFlows: {
      userPassword: true,
      userSrp: true
    },
    oAuth: {
      flows: {
        implicit: true
      },
      // リダイレクトURIの設定
      redirectUrls: [
        "https://mokokero.com/callback",
        "http://localhost:3000/callback"
      ],
      // OAuthスコープの設定
      scopes: [
        "email",
        "openid",
        "profile"
      ]
    }
  }]
});

// Cognitoのリソース情報をエクスポート
export const userPoolId = userPool.id;

// クライアントIDを安全に取得
export const userPoolClientId = userPool.clients && userPool.clients.length > 0 
  ? userPool.clients[0].id 
  : undefined;