import { cluster } from "./cluster";

// ECSサービスの作成
export const myService = new sst.aws.Service("MyService", {
  // 作成したクラスターを使用
  cluster,
  
  // コンテナの設定 - 配列で定義
  containers: [
    {
      // DockerHubの公式Nginxイメージを使用
      image: "nginx:latest",
      name: "app",
    }
  ],
  
  // タスク数の設定
  cpu: "0.25 vCPU",
  memory: "0.5 GB",
  
  // デプロイするサービスの数（冗長性のため複数タスクを実行）
  scaling: {
    min: 1,
    max: 2,
    // CPU使用率が70%を超えるとスケールアウト
    cpuUtilization: 70
  }
});