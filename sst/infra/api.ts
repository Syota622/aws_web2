import { bucket } from "./s3";

export const myApi = new sst.aws.Function("MyApi", {
  url: true,
  link: [bucket],
  handler: "packages/functions/src/api.handler"
});
