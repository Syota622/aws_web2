# Document
https://www.pulumi.com/registry/packages/aws/api-docs/

# コマンド
- pulumi stack ls
stackの一覧を表示

- pulumi stack select dev
stackの選択

- pulumi preview
- pulumi preview --diff
stackのデプロイ前の確認

- pulumi up
stackのデプロイ

- pulumi stack output
stackの出力

- pulumi destroy
AWSリソースの削除

- pulumi stack rm dev
stackの削除

# ワークフロー
1. コードの変更を行う
2. pulumi preview で計画を確認
3. 問題なければ pulumi up を実行

# コードチェック
- tsc --noEmit
TypeScriptは型チェックのみを実行し、JavaScriptファイルの生成を行いません。

- npm install --save-dev @eslint/js globals @typescript-eslint/parser @typescript-eslint/eslint-plugin
eslintをインストール。現状では利用してない
