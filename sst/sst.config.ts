import { $config, Api } from "sst";

export default $config({
  app(input) {
    return {
      name: "my-api-app",
      home: "aws"
    };
  },
  async run({ app }) {
    // APIを定義
    const api = new Api(app, "MyApi", {
      routes: {
        "GET /": {
          function: {
            handler: "functions/hello.handler"
          }
        }
      }
    });

    // 出力値を設定
    app.outputs({
      ApiEndpoint: api.url
    });
  }
});