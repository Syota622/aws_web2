# Remixへようこそ！

- 📖 [Remixドキュメント](https://remix.run/docs)

## 開発

開発サーバーを実行：

```shellscript
pnpm run dev
```

## デプロイ

まず、アプリケーションを本番用にビルドします：

```sh
pnpm run build
```

次に、本番モードでアプリケーションを実行します：

```sh
pnpm start
```

これで、デプロイ先のホストを選ぶ必要があります。

### DIY

Node.jsアプリケーションのデプロイに慣れていれば、組み込みのRemixアプリケーションサーバーは本番環境に対応しています。

`pnpm run build`の出力を必ずデプロイしてください：

- `build/server`
- `build/client`

## スタイリング

このテンプレートには、シンプルな開始体験のために[Tailwind CSS](https://tailwindcss.com/)が既に設定されています。お好みのCSSフレームワークを使用できます。詳細については、[ViteのCSSに関するドキュメント](https://vitejs.dev/guide/features.html#css)を参照してください。