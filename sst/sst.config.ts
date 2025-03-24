/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "sst",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    const storage = await import("./infra/storage");
    await import("./infra/api");
    
    // 新しいネットワーク設定をインポート
    const network = await import("./infra/network");
    
    // ECSクラスター設定をインポート
    const clusterModule = await import("./infra/cluster");

    return {
      MyBucket: storage.bucket.name,
      // VPC情報をエクスポート
      VpcId: network.vpc.id,
      PublicSubnets: network.vpc.publicSubnets,
      PrivateSubnets: network.vpc.privateSubnets,
      // ECSクラスター情報をエクスポート
      ClusterId: clusterModule.cluster.id
    };
  },
});