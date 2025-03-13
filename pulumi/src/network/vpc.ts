import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

export interface VpcArgs {
    cidrBlock: string;
    tags?: { [key: string]: string };
}

export class Vpc extends pulumi.ComponentResource {
    public readonly vpc: aws.ec2.Vpc;

    constructor(name: string, args: VpcArgs, opts?: pulumi.ComponentResourceOptions) {
        super("custom:network:Vpc", name, {}, opts);

        // デフォルトのタグを準備
        const defaultTags = {
            Name: name,
            ManagedBy: "Pulumi"
        };

        // ユーザー指定のタグとマージ
        const tags = { ...defaultTags, ...(args.tags || {}) };

        // VPCを作成
        this.vpc = new aws.ec2.Vpc(name, {
            cidrBlock: args.cidrBlock,
            enableDnsSupport: true,
            enableDnsHostnames: true,
            tags: tags,
        }, { parent: this });

        this.registerOutputs({
            vpcId: this.vpc.id,
            vpcArn: this.vpc.arn,
            vpcCidrBlock: this.vpc.cidrBlock,
        });
    }
}