/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "sst",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
      // // ドメイン設定を追加
      // domain: {
      //   // メインドメイン名を指定
      //   name: "mokokero.com"
      // }
      zone: "Z02401087M019XP5RYF5"
    };
  },
  async run() {
    const storage = await import("./infra/s3");
    await import("./infra/api");

    // Route 53の設定をインポート
    const route53 = await import("./infra/route53");
    
    // 新しいネットワーク設定をインポート
    const network = await import("./infra/vpc-network");
    
    // ECSクラスター設定をインポート
    const clusterModule = await import("./infra/ecs-cluster");

    // ECSサービス設定をインポート
    await import("./infra/ecs-service");

    // Cognito設定をインポート
    const userPool = await import("./infra/cognito/user-pool");
    const userPoolClient = await import("./infra/cognito/user-pool-client");

    // Remix設定をインポート
    await import("./infra/remix");

    // Aurora設定をインポート
    await import("./infra/aurora");

    // DynamoDBバックアップ設定をインポート
    await import("./infra/backup/backup-dynamodb");

    return {
      MyBucket: storage.bucket.name,
      // VPC情報をエクスポート
      VpcId: network.vpc.id,
      PublicSubnets: network.vpc.publicSubnets,
      PrivateSubnets: network.vpc.privateSubnets,
      // ECSクラスター情報をエクスポート
      ClusterId: clusterModule.cluster.id,
      // Cognito情報をエクスポート
      UserPoolId: userPool.userPool.id,
      UserPoolClientId: userPoolClient.userPoolClient.id
    };
  },
});