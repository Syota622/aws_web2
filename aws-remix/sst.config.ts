/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "aws-remix",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    // new sst.aws.Remix("MyWeb");
    const bucket = new sst.aws.Bucket("MyBucket", {
      access: "public"
    });
    new sst.aws.Remix("MyWeb", {
      link: [bucket],
    });
  },
});
