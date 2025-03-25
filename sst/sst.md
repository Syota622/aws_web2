# SST 初心者ガイド: AWS コンポーネントの文法と使い方

SST (Serverless Stack Toolkit) は、AWS インフラをTypeScriptやJavaScriptで簡単に構築するためのフレームワークです。この文書では、SST v3 の基本的な文法と使い方について解説します。

## 目次

1. [SST の基本概念](#sst-の基本概念)
2. [AWS コンポーネントの基本](#aws-コンポーネントの基本)
3. [VPC の定義と使用](#vpc-の定義と使用)
4. [Cluster と Service の使用](#cluster-と-service-の使用)
5. [構成プロパティの共通パターン](#構成プロパティの共通パターン)
6. [nodes と transfer の理解](#nodes-と-transfer-の理解)
7. [よくあるパターンと実装例](#よくあるパターンと実装例)

## SST の基本概念

SST は、AWS インフラをコードとして定義する Infrastructure as Code (IaC) ツールです。AWS CDK や CloudFormation よりも高レベルな抽象化を提供し、複雑なインフラを少ないコードで構築できます。

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

### sst.config.ts の基本構造

```typescript
export default $config({
  app(input) {
    return {
      name: "my-app",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    // インフラモジュールのインポート
    const storage = await import("./infra/storage");
    const network = await import("./infra/network");
    await import("./infra/api");
    
    // 出力値の定義
    return {
      BucketName: storage.bucket.name,
      VpcId: network.vpc.id,
    };
  },
});
```

## AWS コンポーネントの基本

SST v3 では、AWS リソースは `sst.aws.*` 名前空間を通じてアクセスします。これらのコンポーネントはグローバルに使用できます。

### 基本的なリソース作成パターン

```typescript
// リソースの作成
export const bucket = new sst.aws.Bucket("MyBucket");

// オプションを指定してリソースを作成
export const function = new sst.aws.Function("MyFunction", {
  handler: "packages/functions/src/handler.main",
  memory: "1 GB"
});
```

リソースの作成には常に以下のパターンを使用します：

```typescript
const resource = new sst.aws.[ResourceType]("LogicalId", {
  // 設定オプション
});
```

- `ResourceType`: AWS リソースの種類（Bucket, Function, Vpc など）
- `LogicalId`: リソースの論理 ID（一意の識別子）
- 設定オプション: リソース固有の設定をオブジェクトとして指定

## VPC の定義と使用

VPC (Virtual Private Cloud) は、AWS 上で仮想ネットワークを定義するためのサービスです。

### 基本的な VPC の作成

```typescript
export const vpc = new sst.aws.Vpc("MyVpc", {
  // アベイラビリティゾーンの数を指定
  az: 3
});
```

### セキュリティグループを含む VPC の作成

```typescript
export const vpc = new sst.aws.Vpc("MyVpc", {
  az: 2,
  // セキュリティグループを定義
  securityGroups: {
    // "web" という名前のセキュリティグループ
    web: {
      // インバウンドルール（内向き通信）
      inbound: [
        {
          description: "Allow HTTP",
          port: 80,
          cidr: "0.0.0.0/0"  // 全ての IP からのアクセスを許可
        },
        {
          description: "Allow HTTPS",
          port: 443,
          cidr: "0.0.0.0/0"
        }
      ],
      // アウトバウンドルール（外向き通信）は自動的に全許可
    }
  }
});
```

### VPC のサブネットとプロパティ

VPC を作成すると、以下のプロパティにアクセスできます：

```typescript
// VPC ID
vpc.id

// パブリックサブネット（インターネットに直接アクセス可能）
vpc.publicSubnets

// プライベートサブネット（NAT 経由でインターネットにアクセス）
vpc.privateSubnets

// 分離サブネット（インターネットにアクセスできない）
vpc.isolatedSubnets

// セキュリティグループ
vpc.securityGroups.web  // 上記で定義した "web" セキュリティグループ
```

## Cluster と Service の使用

ECS (Elastic Container Service) でコンテナをデプロイするには、Cluster と Service コンポーネントを使用します。

### Cluster の作成

```typescript
import { vpc } from "./network";

export const cluster = new sst.aws.Cluster("MyCluster", {
  // 使用する VPC を指定
  vpc: vpc
});
```

### Service の作成

```typescript
import { cluster } from "./cluster";
import { vpc } from "./network";

export const service = new sst.aws.Service("MyService", {
  // 使用するクラスター
  cluster,
  
  // コンテナ定義（配列で指定）
  containers: [
    {
      // Docker イメージ
      image: "nginx:latest",
      // コンテナ名
      name: "app",
      // 公開するポート
      port: 80
    }
  ],
  
  // リソース設定
  cpu: "0.25 vCPU",
  memory: "0.5 GB",
  
  // スケーリング設定
  scaling: {
    min: 1,  // 最小インスタンス数
    max: 2,  // 最大インスタンス数
    cpuUtilization: 70  // CPU使用率が70%を超えるとスケールアウト
  },
  
  // パブリック URL を作成
  url: true,
  
  // セキュリティグループ
  securityGroups: [vpc.securityGroups.web]
});
```

## 構成プロパティの共通パターン

SST v3 では、いくつかの共通パターンが多くのリソースで使用されています。

### サイズ指定

メモリや CPU などのリソースサイズを指定する場合、人間が読みやすい形式で指定できます：

```typescript
// メモリサイズ
memory: "1 GB"
memory: "512 MB"

// CPU サイズ
cpu: "0.25 vCPU" 
cpu: "1 vCPU"

// 時間指定
timeout: "30 seconds"
interval: "5 minutes"
```

### 条件付き設定

条件に基づいてリソースを設定する場合：

```typescript
new sst.aws.Bucket("MyBucket", {
  // 開発環境ではバケットを自動削除、本番環境では保持
  cdk: {
    autoDeleteObjects: process.env.STAGE !== "prod",
    removalPolicy: process.env.STAGE === "prod" 
      ? "retain"
      : "destroy"
  }
});
```

## nodes と transfer の理解

SST v3 では、`nodes` と `transfer` は複雑なリソース間の関係を扱うための重要な概念です。

### nodes とは

`nodes` プロパティは、AWS リソースの内部コンポーネントやサブリソースにアクセスするためのオブジェクトです。これにより、SST が抽象化している低レベルのリソースにアクセスできます。

```typescript
// VPC の内部リソースにアクセス
const cloudmapNamespace = vpc.nodes.cloudmapNamespace;

// Cluster の内部リソースにアクセス
const ecsCluster = cluster.nodes.cluster;
```

### transfer とは

`transfer` メソッドは、あるリソースから別のリソースに設定情報や権限を「転送」するために使用します。これにより、リソース間の関係を定義できます。

```typescript
// Lambda 関数に S3 バケットへのアクセス権を付与
new sst.aws.Function("MyFunction", {
  handler: "packages/functions/src/handler.main",
  // バケットのアクセス権を関数に転送
  bind: [bucket]
});

// より具体的な権限を転送
bucket.transfer("read-write", {
  // 読み取りと書き込みの権限を付与
  read: true,
  write: true
});

// 転送した権限を使用
function.bind([bucket.transfer("read-only")]);
```

## よくあるパターンと実装例

### 1. Lambda 関数が S3 バケットにアクセスする

```typescript
// S3 バケットの作成
export const bucket = new sst.aws.Bucket("MyBucket");

// Lambda 関数の作成
export const myFunction = new sst.aws.Function("MyFunction", {
  handler: "packages/functions/src/handler.main",
  // バケットへのアクセス権を関数に与える
  bind: [bucket]
});
```

関数コードでのバケットの使用：

```typescript
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { Bucket } from "sst/node/bucket";

export async function main() {
  const s3 = new S3Client({});
  
  // SST が自動的に環境変数を設定
  const bucketName = Bucket.MyBucket.name;
  
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: "example.txt"
  });
  
  const response = await s3.send(command);
  // ...
}
```

### 2. API エンドポイントの作成

```typescript
// API の作成
export const api = new sst.aws.Api("MyApi", {
  routes: {
    // HTTP メソッドとパスを指定
    "GET /items": "packages/functions/src/getItems.handler",
    "POST /items": "packages/functions/src/createItem.handler"
  },
  // CORS 設定
  cors: true
});
```

### 3. VPC 内の RDS データベースを作成

```typescript
import { vpc } from "./network";

// RDS インスタンスの作成
export const database = new sst.aws.RDS("MyDatabase", {
  engine: "postgresql",
  defaultDatabaseName: "mydb",
  // VPC 内に配置
  vpc: vpc,
  // プライベートサブネットに配置
  vpcSubnets: vpc.privateSubnets,
  // セキュリティグループの指定
  securityGroups: [vpc.securityGroups.database]
});

// Lambda 関数からデータベースにアクセス
export const dbFunction = new sst.aws.Function("DbFunction", {
  handler: "packages/functions/src/db.handler",
  // VPC 内に配置（RDS にアクセスするため）
  vpc: {
    id: vpc.id,
    subnetIds: vpc.privateSubnets
  },
  // データベースバインディングを追加
  bind: [database]
});
```

この初心者ガイドが SST v3 の基本的な文法と使い方の理解に役立つことを願っています。SST は継続的に発展しているため、公式ドキュメントを参照して最新の情報を確認することをお勧めします。