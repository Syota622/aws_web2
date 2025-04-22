import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

// ドメイン名を設定（sst.config.tsから取得するか、ここで直接指定）
const domainName = "mokokero.com";

// Route 53 ホストゾーンの作成
export const hostedZone = new aws.route53.Zone("main-hosted-zone", {
  name: domainName,
  comment: `Hosted zone for ${domainName}`,
  tags: {
    Name: domainName,
    Environment: pulumi.getStack(),
    ManagedBy: "sst",
  },
});

// ホストゾーンをエクスポート
export const hostedZoneId = hostedZone.id;
export const hostedZoneNameServers = hostedZone.nameServers;

// SST設定にホストゾーンを登録するための関数
// 他のファイルでこの関数を呼び出して設定を完了させる
export const registerHostedZone = () => {
  return {
    id: hostedZone.id,
    nameServers: hostedZone.nameServers,
  };
};