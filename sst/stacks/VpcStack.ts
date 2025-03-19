import * as aws from "@pulumi/aws";

// VPCスタック関数をエクスポート
export function VpcStack() {
  // プロジェクト名とステージ名を設定
  const projectName = "sst";
  const environment = "prod";
  
  // 共通タグを定義
  const tags = {
    Project: projectName,
    Environment: environment,
    ManagedBy: "SST",
  };

  // VPCを作成
  const vpc = new aws.ec2.Vpc(`${projectName}-vpc-${environment}`, {
    cidrBlock: "10.0.0.0/16",
    enableDnsHostnames: true,
    enableDnsSupport: true,
    tags: {
      ...tags,
      Name: `${projectName}-vpc-${environment}`,
    },
  });

  // 出力を設定
  $stack.output("VpcId", vpc.id);
  $stack.output("VpcArn", vpc.arn);
  $stack.output("VpcCidrBlock", vpc.cidrBlock);

  // 他のリソースで使用できるようにVPCを返す
  return { vpc };
}