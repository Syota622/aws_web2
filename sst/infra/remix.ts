export const remix = new sst.aws.Remix("MyWeb",{
  path: "../remix",
  // domain: "mokokero.com"
  domain:{
    name: "mokokero.com",
    redirects: ["www.mokokero.com"]
  }
});
