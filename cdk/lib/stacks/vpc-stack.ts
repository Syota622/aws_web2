import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

interface VpcStackProps extends cdk.StackProps {
  projectName: string;
  envName: string;
}

export class VpcStack extends cdk.Stack {
  public readonly vpc: ec2.Vpc;

  constructor(scope: Construct, id: string, props: VpcStackProps) {
    super(scope, id, props);

    // リソース名に環境変数を反映
    const resourceName = `vpc-${props.projectName}-${props.envName}`;

    // VPCの作成
    this.vpc = new ec2.Vpc(this, resourceName, {
      // VPCのCIDRブロックを設定
      ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),

      // 最大AZ数を設定
      maxAzs: 2,

      // VPC名を設定
      vpcName: resourceName,
      
      subnetConfiguration: [
        {
          // サブネット名にも環境変数を反映
          name: `Public`,
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 24,
        },
        {
          name: `Private`,
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
          cidrMask: 24,
        },
      ],

      // EIPとNAT Gatewayを無効化
      natGateways: 0,

      // デフォルトセキュリティグループの制限を無効化(インバウンド、アウトバウンドの削除)
      restrictDefaultSecurityGroup: false,
      
    });
  }
}