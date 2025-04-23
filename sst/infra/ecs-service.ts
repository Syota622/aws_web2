import { vpc } from "./vpc-network";
import { cluster } from "./ecs-cluster";

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
  
  // transformを使用してネットワーク設定をカスタマイズ
  transform: {
    // サービスの変換
    service: (args, opts, name) => {
      // ネットワーク設定がなければ初期化
      if (!args.networkConfiguration) {
        args.networkConfiguration = {};
      }
      
      // セキュリティグループの設定
      // 実際のセキュリティグループIDに置き換えてください
      args.networkConfiguration.securityGroups = ["sg-05db76e59ee2ee46b"];
      
      // サブネットの設定（プライベートサブネットを使用）
      args.networkConfiguration.subnets = vpc.publicSubnets;
      
      // パブリックIPの割り当て設定
      args.networkConfiguration.assignPublicIp = true;
      
      // デフォルトのタスク数を2に設定
      args.desiredCount = 2;
      
      // サービスの起動タイプを指定
      args.launchType = "FARGATE";
      
      // ヘルスチェックの猶予期間を設定
      args.healthCheckGracePeriodSeconds = 60;
      
      // タグを追加
      args.tags = {
        ...(args.tags || {}),
        Service: "MyService",
        Environment: process.env.SST_STAGE || "dev"
      };
    },
    
    // タスク定義の変換
    taskDefinition: (args, opts, name) => {
      // タスク定義の設定をカスタマイズ
      // args.executionRoleArn = "arn:aws:iam::123456789012:role/ecsTaskExecutionRole"; // 実際のロールARNに置き換えてください
      
      // ネットワークモードを設定
      args.networkMode = "awsvpc";
      
      // タグを追加
      args.tags = {
        ...(args.tags || {}),
        TaskDefinition: "MyServiceTask",
        Environment: process.env.SST_STAGE || "dev"
      };
    }
  },
  
  // AutoScalingの設定
  scaling: {
    min: 1,
    max: 1,
    cpuUtilization: 70
  },
  
  // ALBの設定
  loadBalancer: {
    // DNS設定 - dnsではなくdomainを使用
    domain: "api.mokokero.com",
    // パブリックサブネットにデプロイしてインターネットからアクセス可能に
    public: true,
    // ルールを定義
    rules: [{
      // リスニングポート
      listen: "80/http",
      // 転送先のコンテナ
      container: "app"
    }]
  }
});

// // サービスARNをエクスポート
// export const serviceArn = myService.arn;