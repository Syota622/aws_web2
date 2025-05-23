// Cognitoユーザープールの作成
export const userPool = new sst.aws.CognitoUserPool("UserPool", {
  
  // transformを使用して詳細設定
  transform: {
    // ユーザープールの設定を変換
    userPool: (args, opts, name) => {
      // ユーザープール名を環境変数付きで設定
      args.name = `my-app-users-${process.env.SST_STAGE || 'dev'}`;
      
      // メールでのサインインを許可
      args.usernameAttributes = ["email"];
      
      // パスワードポリシー
      args.passwordPolicy = {
        minimumLength: 8,
        requireLowercase: true,
        requireNumbers: true,
        requireSymbols: true,
        requireUppercase: true
      };

      // 自動検証メッセージ送信を有効化
      args.autoVerifiedAttributes = ["email"];
      
      // スキーマ定義 (標準属性とカスタム属性)
      args.schemas = [
        {
          name: "email",
          required: true,
          mutable: true,
          attributeDataType: "String"
        },
        {
          name: "given_name",
          required: true,
          mutable: true,
          attributeDataType: "String"
        },
        {
          name: "family_name",
          required: true,
          mutable: true,
          attributeDataType: "String"
        },
        {
          name: "custom:joined_on",
          required: false,
          mutable: true,
          attributeDataType: "String"
        }
      ];
      
      // タグの追加
      args.tags = {
        ...(args.tags || {}),
        Environment: process.env.SST_STAGE || 'dev',
        ManagedBy: "SST"
      };
    },
  }
});

// Cognitoのリソース情報をエクスポート
export const userPoolId = userPool.id;
