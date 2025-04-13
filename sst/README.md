# SST
- 資料
  - リポジトリ
https://sst.dev/docs/set-up-a-monorepo/
  - コンソール（オブザーバービリティみたいな感じ。CloudWatchを参照しなくても良いみたいなことが記載されている
https://sst.dev/docs/console/

- git clone https://github.com/sst-example/sst-example.git
  - https://sst.dev/docs/set-up-a-monorepo/
- pnpm replace-in-file '/monorepo-template/g' 'sst' '**/*.*' --verbose
- pnpm sst diff --stage dev
- pnpm sst deploy --stage dev
- pnpm sst remove --stage dev
- pnpm sst runlock

# ディレクトリ構成
- mkdir -p stacks/network
- mkdir -p stacks/database
- mkdir -p stacks/compute
- mkdir -p stacks/storage
- mkdir -p stacks/security
```sh
sst-example/
├── sst.config.ts        # SST設定ファイル
├── package.json         # プロジェクトの依存関係
├── tsconfig.json        # TypeScript設定
├── stacks/              # インフラ定義のスタック
│   ├── index.ts         # スタックのエントリーポイント
│   ├── network/         # ネットワーク関連スタック
│   │   └── vpc-stack.ts # VPC定義
│   ├── database/        # データベース関連スタック
│   │   └── rds-stack.ts # RDS定義（将来用）
│   ├── storage/         # ストレージ関連スタック
│   │   └── s3-stack.ts  # S3バケット定義
│   ├── compute/         # コンピュート関連スタック
│   │   └── lambda-stack.ts # Lambda関数定義
│   └── api/             # API関連スタック
│       └── api-stack.ts # API定義
├── packages/
│   ├── core/            # 共通機能とユーティリティ
│   │   ├── package.json
│   │   └── src/
│   │       └── index.ts
│   └── functions/       # Lambda関数コード
│       ├── package.json
│       └── src/
│           └── api/
│               └── index.ts
└── config/              # 環境設定ファイル
    ├── dev.json
    └── prod.json
```

# コマンド実行結果例
```sh
% pnpm replace-in-file '/monorepo-template/g' 'sst' '**/*.*' --verbose
Need to install the following packages:
replace-in-file@8.3.0
Ok to proceed? (y) y

Replacing '/monorepo-template/g' with 'sst'
8 file(s) were changed
- sst.config.ts
- package.json
- README.md
- packages/scripts/package.json
- packages/scripts/src/example.ts
- packages/functions/package.json
- packages/functions/src/api.ts
- packages/core/package.json
```

- cd sst-example
- npm install
- zd
```sh
% pnpm sst deploy --stage dev
SST 3.10.0  ready!

➜  App:        sst
   Stage:      dev

~  Deploy

|  Created     default_4_16_6 pulumi:providers:random
|  Created     MyBucket sst:aws:Bucket
|  Created     default_6_66_2 pulumi:providers:aws
|  Created     LambdaEncryptionKey random:index:RandomBytes
|  Created     MyApi sst:aws:Function → MyApiLogGroup aws:cloudwatch:LogGroup
|  Created     MyBucket sst:aws:Bucket → MyBucketBucket aws:s3:BucketV2 (2.1s)
|  Created     MyBucket sst:aws:Bucket → MyBucketPublicAccessBlock aws:s3:BucketPublicAccessBlock
|  Created     MyBucket sst:aws:Bucket → MyBucketCors aws:s3:BucketCorsConfigurationV2
|  Created     MyApi sst:aws:Function → MyApiSourcemap0 aws:s3:BucketObjectv2
|  Created     MyApi sst:aws:Function → MyApiCode aws:s3:BucketObjectv2
|  Created     MyBucket sst:aws:Bucket → MyBucketPolicy aws:s3:BucketPolicy
|  Created     MyApi sst:aws:Function → MyApiRole aws:iam:Role (2.3s)
|  Created     MyApi sst:aws:Function → MyApiFunction aws:lambda:Function (14.8s)
|  Created     MyApi sst:aws:Function → MyApiUrl aws:lambda:FunctionUrl
|  Created     MyApi sst:aws:Function (32.6s)

↗  Permalink   https://sst.dev/u/84fd4a77

✓  Complete    
   MyApi: https://dw7fm5dxjfgkqigmaqlhcxhyfu0fmqcu.lambda-url.ap-northeast-1.on.aws/
   ---
   MyBucket: sst-dev-mybucketbucket-mubkbbrr
```
