# SST 初心者向け完全ガイド: AWS コンポーネントの使い方

SST (Serverless Stack Toolkit) は AWS クラウドインフラを構築するための現代的なフレームワークです。この包括的なガイドでは、SST v3 の基本から応用までを初心者にもわかりやすく解説します。

## 目次

1. [SST の基本概念](#sst-の基本概念)
2. [プロジェクト構造と設定ファイル](#プロジェクト構造と設定ファイル)
3. [AWS コンポーネントの基本](#aws-コンポーネントの基本)
4. [VPC の定義と使用](#vpc-の定義と使用)
5. [コンピューティングリソース (Lambda, ECS)](#コンピューティングリソース)
6. [ストレージリソース (S3, DynamoDB)](#ストレージリソース)
7. [データベースリソース (RDS, DynamoDB)](#データベースリソース)
8. [API とメッセージング](#api-とメッセージング)
9. [認証と認可](#認証と認可)
10. [構成プロパティの共通パターン](#構成プロパティの共通パターン)
11. [高度な概念 (nodes と transfer)](#高度な概念)
12. [デプロイとテスト](#デプロイとテスト)
13. [よくあるパターンと実装例](#よくあるパターンと実装例)

## SST の基本概念

SST は、AWS インフラをコードとして定義する Infrastructure as Code (IaC) ツールです。SST v3 の特長は以下の通りです：

### 主要な特長

- **高レベルな抽象化**: 複雑な AWS リソースを簡潔に定義できます
- **タイプセーフ**: TypeScript の型システムによりエラーを早期に発見できます
- **ローカル開発**: リアルタイムのフィードバックと高速な開発サイクルを提供します
- **ベストプラクティス**: AWS のベストプラクティスが組み込まれています
- **モノレポ対応**: フロントエンドとバックエンドを統合管理できます

### SST v3 の新機能

SST v3 では、以前のバージョンと比べて大きな変更がありました：

- AWS CDK から Pulumi への移行
- より直感的な API デザイン
- グローバルな `sst` オブジェクト
- ステージごとの独立した環境
- 高速なデプロイ

## プロジェクト構造と設定ファイル

### 基本的なプロジェクト構造

```
my-sst-app/
├── infra/              # インフラ定義
│   ├── storage.ts      # ストレージリソース (S3, DynamoDB など)
│   ├── network.ts      # ネットワークリソース (VPC など)
│   ├── compute.ts      # コンピューティングリソース (Lambda, ECS など)
│   └── api.ts          # API リソース
├── packages/           # アプリケーションコード
│   ├── functions/      # Lambda 関数
│   └── web/            # Web フロントエンド
├── sst.config.ts       # SST 設定ファイル
└── package.json
```

### sst.config.ts の詳細

`sst.config.ts` はプロジェクトの中心となる設定ファイルです：

```typescript
export default $config({
  // アプリの基本設定
  app(input) {
    return {
      name: "my-app",                                     // アプリ名
      removal: input?.stage === "production" ? "retain" : "remove", // リソース削除ポリシー
      protect: ["production"].includes(input?.stage),     // 保護設定
      home: "aws",                                        // デプロイ先
    };
  },
  // リソース定義と出力
  async run() {
    // インフラモジュールのインポート
    const storage = await import("./infra/storage");
    const network = await import("./infra/network");
    await import("./infra/api");
    
    // 出力値の定義（CloudFormation 出力として表示）
    return {
      BucketName: storage.bucket.name,
      VpcId: network.vpc.id,
    };
  },
});
```

#### 設定オプションの説明

- **name**: CloudFormation スタックの名前として使用されます
- **removal**: リソースを削除する際のポリシー（`remove` または `retain`）
- **protect**: スタックの保護設定（誤って削除されるのを防ぐ）
- **home**: デプロイ先（現在は `aws` のみサポート）

## AWS コンポーネントの基本

### リソース作成の基本パターン

SST v3 では、AWS リソースは `sst.aws.*` 名前空間を通じてアクセスします：

```typescript
// 基本的なリソース作成
export const bucket = new sst.aws.Bucket("MyBucket");

// オプションを指定したリソース作成
export const function = new sst.aws.Function("MyFunction", {
  handler: "packages/functions/src/handler.main",
  memory: "1 GB"
});
```

### リソースプロパティへのアクセス

リソースを作成すると、そのプロパティにアクセスできます：

```typescript
// バケット名にアクセス
console.log(bucket.name);

// 関数の URL にアクセス
console.log(function.url);
```

### 環境変数としてのリソース情報

SST は自動的にリソース情報を環境変数として Lambda 関数に渡します：

```typescript
// Lambda 関数内で SST リソースにアクセス
import { Bucket } from "sst/node/bucket";

export const handler = async () => {
  // 環境変数から自動的に取得
  const bucketName = Bucket.MyBucket.name;
  // ...
};
```

## VPC の定義と使用

### 基本的な VPC の作成

```typescript
// 最もシンプルな VPC 作成
export const vpc = new sst.aws.Vpc("MyVpc");

// カスタマイズした VPC
export const customVpc = new sst.aws.Vpc("CustomVpc", {
  az: 3,                    // アベイラビリティゾーンの数
  natGateways: 1,           // NAT ゲートウェイの数（コスト削減）
  ipAddresses: "10.0.0.0/16", // カスタム CIDR ブロック
  flowLogs: true            // VPC フローログの有効化
});
```

### VPC サブネットの種類と用途

VPC には 3 種類のサブネットがあります：

1. **パブリックサブネット (`vpc.publicSubnets`)**: 
   - インターネットに直接アクセス可能
   - ロードバランサーなど、パブリックアクセスが必要なリソース向け

2. **プライベートサブネット (`vpc.privateSubnets`)**:
   - インターネットへの送信アクセスのみ（NAT ゲートウェイ経由）
   - アプリケーションサーバー、RDS など、間接的なインターネットアクセスが必要なリソース向け

3. **分離サブネット (`vpc.isolatedSubnets`)**:
   - インターネットアクセスなし
   - 内部データベースなど、完全に隔離すべきリソース向け

### セキュリティグループの詳細設定

セキュリティグループはファイアウォールのように機能し、トラフィックを制御します：

```typescript
export const vpc = new sst.aws.Vpc("MyVpc", {
  securityGroups: {
    // ウェブトラフィック用セキュリティグループ
    web: {
      // インバウンドルール（内向き通信）
      inbound: [
        {
          description: "HTTP アクセス",
          port: 80,            // ポート番号
          cidr: "0.0.0.0/0"    // ソース IP 範囲（全ての IP）
        },
        {
          description: "HTTPS アクセス",
          port: 443,
          cidr: "0.0.0.0/0"
        }
      ],
      // アウトバウンドルール（外向き通信）は自動的に全許可
    },
    // データベースアクセス用セキュリティグループ
    database: {
      inbound: [
        {
          description: "PostgreSQL アクセス",
          port: 5432,
          // 特定のセキュリティグループからの通信のみ許可
          securityGroups: ["web"]  // web セキュリティグループからのアクセス許可
        }
      ]
    }
  }
});
```

### VPC エンドポイントの設定

VPC エンドポイントを使用すると、インターネットを経由せずに AWS サービスにアクセスできます：

```typescript
export const vpc = new sst.aws.Vpc("MyVpc", {
  // VPC エンドポイントの設定
  endpoints: {
    s3: true,               // S3 エンドポイント
    dynamodb: true          // DynamoDB エンドポイント
  }
});
```

## コンピューティングリソース

### Lambda 関数

Lambda 関数は SST の中心的なコンポーネントです：

```typescript
// 基本的な Lambda 関数
export const basicFunction = new sst.aws.Function("BasicFunction", {
  handler: "packages/functions/src/handler.main"
});

// 詳細なオプションを持つ関数
export const advancedFunction = new sst.aws.Function("AdvancedFunction", {
  handler: "packages/functions/src/handler.main",
  runtime: "nodejs18.x",      // Node.js ランタイムバージョン
  memory: "1 GB",             // メモリサイズ
  timeout: "30 seconds",      // タイムアウト設定
  environment: {              // 環境変数
    TABLE_NAME: "my-table",
    DEBUG: "true"
  },
  architecture: "arm64",      // アーキテクチャ（ARM でコスト削減）
  url: true,                  // 関数 URL を有効化
  permissions: [              // IAM 権限
    "dynamodb:PutItem",
    "s3:GetObject"
  ]
});
```

#### Lambda のバインディング

他のリソースを Lambda 関数にバインド（接続）して、アクセス権を付与できます：

```typescript
// S3 バケットを作成
const bucket = new sst.aws.Bucket("MyBucket");

// バケットにアクセスできる Lambda 関数
export const function = new sst.aws.Function("MyFunction", {
  handler: "packages/functions/src/handler.main",
  bind: [bucket]  // バケットへのアクセス権を付与
});
```

### ECS クラスターとサービス

コンテナを実行するための ECS リソース：

#### クラスターの作成

```typescript
// 基本的な ECS クラスター
export const cluster = new sst.aws.Cluster("MyCluster", {
  vpc: vpc  // 使用する VPC
});
```

#### サービスの作成

```typescript
// ECS サービス定義
export const service = new sst.aws.Service("MyService", {
  cluster,  // 使用するクラスター
  
  // コンテナ定義（配列）
  containers: [
    {
      // メインコンテナ
      image: "nginx:latest",  // Docker イメージ
      name: "app",            // コンテナ名
      port: 80,               // 公開ポート
      env: {                  // 環境変数
        NODE_ENV: "production"
      },
      // ヘルスチェック設定
      healthCheck: {
        command: ["CMD-SHELL", "curl -f http://localhost/ || exit 1"],
        interval: "30 seconds",
        timeout: "5 seconds",
        retries: 3
      }
    },
    // サイドカーコンテナ（オプション）
    {
      image: "datadog/agent:latest",
      name: "monitoring",
      env: {
        DD_API_KEY: "xxx"
      }
    }
  ],
  
  // リソース設定
  cpu: "0.5 vCPU",
  memory: "1 GB",
  
  // スケーリング設定
  scaling: {
    min: 2,               // 最小インスタンス数
    max: 10,              // 最大インスタンス数
    cpuUtilization: 70,   // CPU 使用率に基づくスケーリング
    memoryUtilization: 80 // メモリ使用率に基づくスケーリング
  },
  
  // パブリック URL の有効化
  url: true,
  
  // カスタムヘルスチェック
  healthCheck: {
    path: "/health",
    interval: "20 seconds"
  },
  
  // セキュリティグループ
  securityGroups: [vpc.securityGroups.web]
});
```

## ストレージリソース

### S3 バケット

オブジェクトストレージの定義：

```typescript
// 基本的な S3 バケット
export const basicBucket = new sst.aws.Bucket("BasicBucket");

// 詳細設定を持つ S3 バケット
export const advancedBucket = new sst.aws.Bucket("AdvancedBucket", {
  cors: true,                // CORS 設定を有効化
  public: true,              // パブリックアクセスを許可
  blockPublicACLs: false,    // パブリック ACL を許可
  deployment: {              // デプロイ時にファイルをアップロード
    source: "path/to/files", // ソースディレクトリ
    destination: "assets"    // 宛先プレフィックス
  },
  notifications: {           // イベント通知
    myfunction: {            // 通知先の名前
      function: "path/to/handler.main", // 通知を受け取る関数
      events: ["object_created"]        // 通知対象のイベント
    }
  },
  lifecycleRules: [          // ライフサイクルルール
    {
      expiration: "90 days", // 90日後に削除
      prefix: "temp/"        // temp/ プレフィックスのオブジェクトに適用
    }
  ]
});
```

### DynamoDB テーブル

NoSQL データベースの定義：

```typescript
// 基本的な DynamoDB テーブル
export const basicTable = new sst.aws.Table("BasicTable", {
  fields: {
    pk: "string",  // パーティションキー
    sk: "string",  // ソートキー
  },
  primaryIndex: { partitionKey: "pk", sortKey: "sk" }
});

// 詳細設定を持つ DynamoDB テーブル
export const advancedTable = new sst.aws.Table("AdvancedTable", {
  fields: {
    userId: "string",
    noteId: "string",
    created: "string",
    content: "string"
  },
  primaryIndex: { partitionKey: "userId", sortKey: "noteId" },
  // グローバルセカンダリインデックス
  globalIndexes: {
    byDate: { partitionKey: "userId", sortKey: "created" }
  },
  // ローカルセカンダリインデックス
  localIndexes: {
    byContent: { sortKey: "content" }
  },
  // 詳細設定
  dynamodbTable: {
    billingMode: "PAY_PER_REQUEST",    // オンデマンド課金モード
    timeToLiveAttribute: "expireAt",   // TTL 属性
    pointInTimeRecovery: true          // ポイントインタイムリカバリ
  },
  // コンシューマー設定
  consumers: {
    notify: {
      function: "packages/functions/src/notify.handler", // 処理関数
      filters: {
        // 特定の条件のみを処理
        eventName: ["INSERT", "MODIFY"]
      }
    }
  }
});
```

## データベースリソース

### RDS データベース

リレーショナルデータベースの定義：

```typescript
// PostgreSQL RDS インスタンス
export const postgres = new sst.aws.RDS("MyPostgres", {
  engine: "postgresql15",        // データベースエンジン
  defaultDatabaseName: "myapp",  // デフォルトデータベース名
  
  // VPC 設定
  vpc: vpc,
  vpcSubnets: vpc.privateSubnets,  // プライベートサブネットに配置
  securityGroups: [vpc.securityGroups.database],
  
  // インスタンス設定
  scaling: {
    instances: {
      min: 1,        // 最小インスタンス数
      max: 1         // 最大インスタンス数
    },
    autoPause: true, // 未使用時に自動停止
    maxCapacity: 4   // 最大容量（ACU）
  },
  
  // 詳細設定
  migrations: "packages/migrations",  // マイグレーションスクリプト
  types: "packages/core/sql.ts",      // 型定義の出力先
  cdk: {
    storageEncrypted: true     // ストレージ暗号化
  }
});
```

### Aurora Serverless

サーバーレス RDS クラスターの定義：

```typescript
// Aurora Serverless クラスター
export const aurora = new sst.aws.RDS("MyAurora", {
  engine: "mysql8.0",            // MySQL エンジン
  defaultDatabaseName: "myapp",  // デフォルトデータベース名
  
  // サーバーレス設定
  serverless: true,
  scaling: {
    minCapacity: 0.5,   // 最小容量（ACU）
    maxCapacity: 8      // 最大容量（ACU）
  },
  
  // VPC 設定
  vpc: vpc,
  vpcSubnets: vpc.isolatedSubnets,  // 分離サブネットに配置
  securityGroups: [vpc.securityGroups.database]
});
```

## API とメッセージング

### API Gateway

REST API と HTTP API の定義：

```typescript
// HTTP API（軽量で低コスト）
export const httpApi = new sst.aws.Api("HttpApi", {
  routes: {
    "GET /items": "packages/functions/src/getItems.handler",
    "POST /items": "packages/functions/src/createItem.handler",
    "GET /items/{id}": "packages/functions/src/getItem.handler"
  },
  cors: true  // CORS 設定を有効化
});

// REST API（高度な機能）
export const restApi = new sst.aws.Api("RestApi", {
  routes: {
    "GET /items": "packages/functions/src/getItems.handler"
  },
  customDomain: {                   // カスタムドメイン
    domainName: "api.example.com",
    hostedZone: "example.com"
  },
  authorizers: {                    // 認証設定
    jwt: {
      type: "jwt",
      identitySource: "$request.header.Authorization",
      issuer: "https://cognito-idp.us-east-1.amazonaws.com/my-user-pool"
    }
  },
  accessLog: true,                  // アクセスログの有効化
  throttle: {                       // スロットリング設定
    rate: 100,                      // 1秒あたりのリクエスト数
    burst: 50                       // バーストリクエスト数
  }
});
```

### SQS キュー

メッセージキューの定義：

```typescript
// 基本的な SQS キュー
export const queue = new sst.aws.Queue("MyQueue", {
  // コンシューマー関数
  consumer: "packages/functions/src/consumer.handler"
});

// 詳細設定を持つ SQS キュー
export const advancedQueue = new sst.aws.Queue("AdvancedQueue", {
  consumer: {
    function: "packages/functions/src/consumer.handler",
    cdk: {
      enabled: true,
      maxConcurrency: 5,      // 最大同時実行数
      maxBatchingWindow: 30   // バッチ処理の最大待機時間（秒）
    }
  },
  cdk: {
    queue: {
      visibilityTimeout: 300,            // 可視性タイムアウト（秒）
      deliveryDelay: 60,                 // 配信遅延（秒）
      receiveMessageWaitTime: 20,        // ロングポーリング時間（秒）
      fifo: true,                        // FIFO キュー
      contentBasedDeduplication: true    // コンテンツベースの重複排除
    }
  }
});
```

### EventBridge

イベントドリブンアーキテクチャの構築：

```typescript
// イベントバスの定義
export const bus = new sst.aws.EventBus("MyEventBus");

// イベントルールの定義
export const rule = new sst.aws.EventBus.Rule("MyRule", {
  bus,  // 使用するイベントバス
  pattern: {
    source: ["my-service"],
    detailType: ["order-placed"]
  },
  targets: {
    processOrder: "packages/functions/src/processOrder.handler",
    notifyShipping: "packages/functions/src/notifyShipping.handler"
  }
});
```

## 認証と認可

### Cognito

ユーザー認証の設定：

```typescript
// ユーザープールの作成
export const auth = new sst.aws.Cognito("Auth", {
  login: ["email", "phone"],   // ログイン方法
  triggers: {                  // トリガー関数
    preSignUp: "packages/functions/src/preSignUp.handler"
  },
  cdk: {
    userPool: {
      selfSignUpEnabled: true,          // セルフサインアップを許可
      autoVerify: { email: true },      // メール自動検証
      passwordPolicy: {                 // パスワードポリシー
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireNumbers: true,
        requireSymbols: false
      }
    }
  }
});

// API と Cognito の統合
export const api = new sst.aws.Api("ProtectedApi", {
  routes: {
    "GET /protected": "packages/functions/src/protected.handler"
  },
  authorizers: {
    userPool: {
      type: "user_pool",
      userPool: {
        id: auth.userPoolId,
        clientIds: [auth.userPoolClientId]
      }
    }
  },
  defaults: {
    authorizer: "userPool"  // デフォルトの認可方法
  }
});
```

## 構成プロパティの共通パターン

### サイズと時間の指定

```typescript
// メモリサイズ
memory: "512 MB"
memory: "1 GB"

// CPU サイズ
cpu: "0.25 vCPU"
cpu: "1 vCPU"

// 時間指定
timeout: "30 seconds"
timeout: "5 minutes"
interval: "1 hour"
```

### 条件付き構成

```typescript
// 環境変数に基づく条件付き設定
const isProduction = process.env.STAGE === "prod";

new sst.aws.Bucket("MyBucket", {
  // 本番環境では自動削除しない
  cdk: {
    autoDeleteObjects: !isProduction,
    removalPolicy: isProduction ? "retain" : "destroy"
  }
});
```

### 権限の設定

```typescript
// 基本的な権限設定
new sst.aws.Function("MyFunction", {
  permissions: [
    "s3:GetObject",
    "dynamodb:PutItem"
  ]
});

// より詳細な権限設定
new sst.aws.Function("MyFunction", {
  permissions: [
    {
      actions: ["s3:GetObject", "s3:PutObject"],
      resources: [bucket.arn + "/*"]
    }
  ]
});
```

## 高度な概念

### nodes

`nodes` プロパティを使用すると、SST が抽象化している低レベルのリソースコンポーネントにアクセスできます：

```typescript
// VPC の内部リソースにアクセス
const privateRouteTable = vpc.nodes.privateRouteTable;
const natGateway = vpc.nodes.natGateway;
const cloudmapNamespace = vpc.nodes.cloudmapNamespace;

// S3 バケットの内部リソースにアクセス
const bucketResource = bucket.nodes.bucket;
```

### transfer

`transfer` メソッドを使用すると、リソース間で適切な権限を転送できます：

```typescript
// 基本的な転送（すべての権限）
function.bind([bucket]);

// 読み取り専用権限を転送
function.bind([bucket.transfer("read")]);

// カスタム転送設定
function.bind([
  bucket.transfer("custom", {
    // カスタム権限
    read: true,
    write: ["uploads/*"],  // 特定のパスのみ書き込み可能
    notifications: true
  })
]);
```

## デプロイとテスト

### デプロイコマンド

```bash
# 開発環境へのデプロイ
npx sst deploy --stage dev

# 本番環境へのデプロイ
npx sst deploy --stage prod

# 特定のスタックのみデプロイ
npx sst deploy --stack MyStack
```

### ローカル開発

```bash
# ローカル開発環境を起動
npx sst dev

# ローカルテスト
npx sst bind -- vitest run
```

### 出力とモニタリング

```bash
# スタックの出力を表示
npx sst output

# ログの表示
npx sst logs
```

## よくあるパターンと実装例

### 1. Web アプリケーションのバックエンド

```typescript
// API
export const api = new sst.aws.Api("MyApi", {
  routes: {
    "GET /items": "packages/functions/src/getItems.handler",
    "POST /items": "packages/functions/src/createItem.handler"
  },
  cors: true
});

// DB
export const table = new sst.aws.Table("ItemsTable", {
  fields: {
    id: "string",
    createdAt: "string",
    content: "string"
  },
  primaryIndex: { partitionKey: "id" }
});

// API と DB の連携
new sst.aws.Function("GetItemsFunction", {
  handler: "packages/functions/src/getItems.handler",
  bind: [table]  // テーブルへのアクセス権を付与
});
```

### 2. イベント駆動型マイクロサービス

```typescript
// イベントバス
export const bus = new sst.aws.EventBus("MyEventBus");

// キュー
export const orderQueue = new sst.aws.Queue("OrderQueue", {
  consumer: "packages/functions/src/processOrder.handler"
});

// イベントルール
export const orderRule = new sst.aws.EventBus.Rule("OrderRule", {
  bus,
  pattern: { detailType: ["order-placed"] },
  targets: {
    queue: orderQueue
  }
});

// イベント発行関数
export const createOrder = new sst.aws.Function("CreateOrderFunction", {
  handler: "packages/functions/src/createOrder.handler",
  bind: [bus]  // イベントバスにイベントを発行する権限
});
```

### 3. フルスタックアプリケーション

```typescript
// フロントエンド
export const site = new sst.aws.StaticSite("Web", {
  path: "packages/web",
  buildOutput: "dist",
  buildCommand: "npm run build",
  environment: {
    API_URL: api.url
  }
});

// バックエンド API
export const api = new sst.aws.Api("Api", {
  routes: {
    "GET /items": "packages/functions/src/getItems.handler"
  }
});

// データベース
export const db = **new**