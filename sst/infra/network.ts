// SSTのグローバルオブジェクトを使用
export const vpc = new sst.aws.Vpc("MyVpc", {
  az: 3
});

// カスタムのセキュリティグループを作成
export const serviceSecurityGroup = new aws.ec2.SecurityGroup("ServiceSecurityGroup", {
  vpcId: vpc.id,
  description: "Allow HTTP traffic",
  ingress: [
    {
      description: "HTTP from anywhere",
      fromPort: 80,
      toPort: 80,
      protocol: "tcp",
      cidrBlocks: ["0.0.0.0/0"]
    }
  ],
  egress: [
    {
      fromPort: 0,
      toPort: 0,
      protocol: "-1",
      cidrBlocks: ["0.0.0.0/0"]
    }
  ],
  tags: {
    Name: "ServiceSecurityGroup"
  }
});

// VPC情報をエクスポート
export const vpcInfo = {
  id: vpc.id,
  publicSubnets: vpc.publicSubnets,
  privateSubnets: vpc.privateSubnets
};