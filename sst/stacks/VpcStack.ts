import { StackContext } from "sst/constructs";
import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

export function NetworkStack({ stack }: StackContext) {
  // VPCリソースを作成
  const vpc = new aws.ec2.Vpc("MainVpc", {
    cidrBlock: "10.0.0.0/16",
    enableDnsSupport: true,
    enableDnsHostnames: true,
    tags: {
      Name: `${stack.stage}-main-vpc`,
      Environment: stack.stage,
      ManagedBy: "SST",
    },
  });

  // VPC IDを出力
  stack.addOutputs({
    VpcId: vpc.id,
    VpcArn: vpc.arn,
    CidrBlock: vpc.cidrBlock,
  });

  // スタックから他の場所でも使えるように返す
  return { vpc };
}