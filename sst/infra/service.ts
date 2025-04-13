import { cluster } from "./cluster";

// ECSサービスの作成 - ALB付き
export const myService = new sst.aws.Service("MyService", {
  // 作成したクラスターを使用
  cluster,
  
  // コンテナの設定
  containers: [
    {
      // DockerHubの公式Nginxイメージを使用
      image: "nginx:latest",
      name: "app"
    }
  ],
  
  // タスク数の設定
  cpu: "0.25 vCPU",
  memory: "0.5 GB",
  
  // AutoScalingの設定
  scaling: {
    min: 1,
    max: 2,
    cpuUtilization: 70
  },
  
  // ALBの設定
  loadBalancer: {
    // パブリックサブネットにデプロイしてインターネットからアクセス可能に
    public: true,
    // ルールを定義 - シンプルな形式で試す
    rules: [{
      // リスニングポート
      listen: "80/http",
      // 転送先のコンテナ
      container: "app"
    }]
  }
});