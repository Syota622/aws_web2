import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

export interface InternetGatewayArgs {
    vpcId: pulumi.Input<string>;
    tags?: { [key: string]: string };
}

export class InternetGateway extends pulumi.ComponentResource {
    public readonly internetGateway: aws.ec2.InternetGateway;

    constructor(name: string, args: InternetGatewayArgs, opts?: pulumi.ComponentResourceOptions) {
        super("custom:network:InternetGateway", name, {}, opts);

        // デフォルトのタグを準備
        const defaultTags = {
            Name: name,
            ManagedBy: "Pulumi"
        };

        // ユーザー指定のタグとマージ
        const tags = { ...defaultTags, ...(args.tags || {}) };

        // インターネットゲートウェイを作成
        this.internetGateway = new aws.ec2.InternetGateway(name, {
            vpcId: args.vpcId,
            tags: tags,
        }, { parent: this });

        this.registerOutputs({
            internetGatewayId: this.internetGateway.id,
            internetGatewayArn: this.internetGateway.arn,
        });
    }
}