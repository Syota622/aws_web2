# SST
- 資料
  - リポジトリ
https://sst.dev/docs/set-up-a-monorepo/
  - コンソール（オブザーバービリティみたいな感じ。CloudWatchを参照しなくても良いみたいなことが記載されている
https://sst.dev/docs/console/

- git clone https://github.com/sst-example/sst-example.git
  - https://sst.dev/docs/set-up-a-monorepo/
- pnpm replace-in-file '/monorepo-template/g' 'sst' '**/*.*' --verbose
- pnpm sst diff --stage dev(ローカルとクラウドの状態を比較)
- pnpm sst deploy --stage dev(デプロイ)
- pnpm sst remove --stage dev(削除)
- pnpm sst runlock(ロックファイルを作成)
- pnpm sst diff --stage dev --print-logs(ログを出力)
- pnpm sst deploy --stage dev --print-logs(ログを出力)
- pnpm sst refresh --stage dev(ローカルとクラウドの状態を一致させる)
- pnpm store prune(パッケージのキャッシュを削除)

- pnpm approve-build(ビルドを承認)
```yml
ignoredBuiltDependencies:
  - esbuild
```

## エラーが発生した場合の対応方法
キャッシュを削除して再インストール
- rm -rf .sst
  - pnpm sst diff --stage devを実行すると自動的に.sstディレクトリが作成される
- rm -rf node_modules
  - pnpm installを実行すると自動的にnode_modulesディレクトリが作成される

# コマンド実行結果例
```sh
% pnpm replace-in-file '/monorepo-template/g' 'sst' '**/*.*' --verbose
Need to install the following packages:
replace-in-file@8.3.0
Ok to proceed? (y) y

〜〜　省略　〜〜
- packages/functions/src/api.ts
- packages/core/package.json
```

- cd sst-example
- npm install
- zd
```sh
% pnpm sst deploy --stage dev
SST 3.10.0  ready!
〜〜　省略　〜〜
   ---
   MyBucket: sst-dev-mybucketbucket-mubkbbrr
```

# ディレクトリ構成（現在は違うもの）
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