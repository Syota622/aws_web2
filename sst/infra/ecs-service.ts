import { vpc, ecsTaskSecurityGroup, albSecurityGroup } from "./vpc-network";
import { cluster } from "./ecs-cluster";

// ECSサービスの作成 - ALB付き
export const myService = new sst.aws.Service("MyService", {
  // 作成したクラスターを使用
  cluster,
  
  // Dockerfileを使用したイメージ設定
  containers: [
    {
      // Dockerfileの参照
      image: {
        context: "../backend", // プロジェクトルートからbackendフォルダへのパス
        dockerfile: "../backend/Dockerfile.prod" // Dockerfileへの完全なパス
      },
      name: "app", // コンテナ名を「app」に設定
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
      args.networkConfiguration.securityGroups = [ecsTaskSecurityGroup];
      
      // サブネットの設定（プライベートサブネットを使用）
      args.networkConfiguration.subnets = vpc.publicSubnets;
      
      // パブリックIPの割り当て設定
      args.networkConfiguration.assignPublicIp = true;
      
      // デフォルトのタスク数を2に設定
      args.desiredCount = 1;
      
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
    },

    // ALBの変換
    loadBalancer: (args, opts, name) => {
      // ALBのセキュリティグループを設定
      args.securityGroups = [albSecurityGroup];
      
      // リスナーのタイムアウト設定
      args.idleTimeout = 60;
      
      // タグを追加
      args.tags = {
        ...(args.tags || {}),
        LoadBalancer: "MyServiceALB",
        Environment: process.env.SST_STAGE || "dev"
      };
    },
    
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
    rules: [
      {
        // HTTPSリスナー
        listen: "443/https",
        // 転送先のコンテナ
        container: "app",
        forward: "3000/http"
      },
      {
        // HTTPリスナー - HTTPSへリダイレクト
        listen: "80/http",
        // HTTPSへリダイレクト設定
        redirect: "443/https"
      }
    ],
    health: {
      "3000/http": {
        path: "/",
        interval: "10 seconds"
      }
    }
  }
});

// // サービスARNをエクスポート
// export const serviceArn = myService.arn;