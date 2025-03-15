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

# ワークフロー
1. コードの変更を行う
2. pulumi preview で計画を確認
3. 問題なければ pulumi up を実行

# コードチェック
- tsc --noEmit
TypeScriptは型チェックのみを実行し、JavaScriptファイルの生成を行いません。
