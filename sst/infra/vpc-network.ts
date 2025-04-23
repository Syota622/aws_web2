// SSTのグローバルオブジェクトを使用
export const vpc = new sst.aws.Vpc("MyVpc", {
  az: 3
});

// カスタムのセキュリティグループを作成
export const ecsTaskSecurityGroup = new aws.ec2.SecurityGroup("ecsTaskSecurityGroup", {
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
    Name: "ECSecsTaskSecurityGroup"
  }
});

// ALB用のセキュリティグループを作成
export const albSecurityGroup = new aws.ec2.SecurityGroup("AlbSecurityGroup", {
  vpcId: vpc.id,
  description: "Security group for Application Load Balancer",
  ingress: [
    {
      description: "Allow HTTP from anywhere",
      fromPort: 80,
      toPort: 80,
      protocol: "tcp",
      cidrBlocks: ["0.0.0.0/0"]
    },
    {
      description: "Allow HTTPS from anywhere",
      fromPort: 443,
      toPort: 443,
      protocol: "tcp",
      cidrBlocks: ["0.0.0.0/0"]
    }
  ],
  egress: [
    {
      fromPort: 0,
      toPort: 0,
      protocol: "-1", // すべてのプロトコル
      cidrBlocks: ["0.0.0.0/0"]
    }
  ],
  tags: {
    Name: "ALB-SG",
    Environment: process.env.SST_STAGE || "dev"
  }
});

// VPC情報をエクスポート
export const vpcInfo = {
  id: vpc.id,
  publicSubnets: vpc.publicSubnets,
  privateSubnets: vpc.privateSubnets
};

// セキュリティグループIDをエクスポート
export const ecsTaskSgId = ecsTaskSecurityGroup.id;
export const albSgId = albSecurityGroup.id;