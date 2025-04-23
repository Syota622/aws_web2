import { vpc } from "./vpc-network";

// ECSクラスターの作成
export const cluster = new sst.aws.Cluster("MyCluster", {
  // 作成したVPCオブジェクトをそのまま使用
  vpc: vpc,
  // transformを使用してクラスターをカスタマイズ
  transform: {
    // クラスターリソースの変換
    cluster: (args, opts, name) => {

      // クラスターの設定を変更
      args.name = "MyCustomECSCluster";
      
      // CloudWatchコンテナインサイトの有効化
      args.settings = [
        {
          name: "containerInsights",
          value: "enabled"
        }
      ];
      
      // タグの追加
      args.tags = {
        ...(args.tags || {}),
        Environment: process.env.SST_STAGE || "dev",
        ManagedBy: "SST"
      };
      
      // transformメソッドではundefinedを返す
    }
  }
});

// // クラスターARNをエクスポート
// export const clusterId = cluster.id;
