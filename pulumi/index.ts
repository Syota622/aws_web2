import * as pulumi from "@pulumi/pulumi";
import { Vpc } from "./src/network/vpc";
import { InternetGateway } from "./src/network/internet-gateway";

// 設定を取得
const config = new pulumi.Config();
const projectName = config.get("projectName") || "pulumi";

// 環境変数を取得（または設定）
const env = config.get("environment") || "dev";

// VPCの作成
const mainVpc = new Vpc(`${projectName}-vpc-${env}`, {
    cidrBlock: "10.0.0.0/16",
    tags: {
        Project: projectName,
        Environment: env,
    },
});

// インターネットゲートウェイの作成
const mainIgw = new InternetGateway(`${projectName}-igw-${env}`, {
    vpcId: mainVpc.vpc.id,
    tags: {
        Project: projectName,
        Environment: env,
    },
});

// 出力
export const vpcId = mainVpc.vpc.id;
export const vpcCidrBlock = mainVpc.vpc.cidrBlock;
export const internetGatewayId = mainIgw.internetGateway.id;
