import { vpc } from "./vpc-network";

// ECSクラスターの作成
export const cluster = new sst.aws.Cluster("MyCluster", {
  // 作成したVPCオブジェクトをそのまま使用
  vpc: vpc,
});