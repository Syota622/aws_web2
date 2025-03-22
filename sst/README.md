# SST
- 資料
  - リポジトリ
https://sst.dev/docs/set-up-a-monorepo/
  - コンソール（オブザーバービリティみたいな感じ。CloudWatchを参照しなくても良いみたいなことが記載されている
https://sst.dev/docs/console/

- git clone https://github.com/sst-example/sst-example.git
  - https://sst.dev/docs/set-up-a-monorepo/
- npx replace-in-file '/monorepo-template/g' 'sst' '**/*.*' --verbose
- npx sst diff --stage dev
- npx sst deploy --stage dev
- npx sst remove --stage dev
- npx sst runlock

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
