// SSTのグローバルオブジェクトを使用
export const vpc = new sst.aws.Vpc("MyVpc", {
  az: 3
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

//////// Security Group Rule コーディング(循環参照を避けるため別のリソースとして作成) ////////
// ECS Task用のセキュリティグループを作成
export const ecsTaskSecurityGroup = new aws.ec2.SecurityGroup("ecsTaskSecurityGroup", {
  vpcId: vpc.id,
  ingress: [], // デフォルトを反映させないために空にしている
  egress: [], // デフォルトを反映させないために空にしている
  description: "Allow HTTP traffic",
  tags: {
    Name: "ECSecsTaskSecurityGroup"
  }
});

// ALBからECSタスクへのセキュリティグループルールを追加
export const albToHttpIngress = new aws.ec2.SecurityGroupRule("albToHttpIngress", {
  type: "ingress",
  fromPort: 80,
  toPort: 80,
  protocol: "tcp",
  sourceSecurityGroupId: albSecurityGroup.id,
  securityGroupId: ecsTaskSecurityGroup.id,
  description: "Allow HTTP traffic from ALB"
});

export const albToHttpsIngress = new aws.ec2.SecurityGroupRule("albToHttpsIngress", {
  type: "ingress",
  fromPort: 443,
  toPort: 443,
  protocol: "tcp",
  sourceSecurityGroupId: albSecurityGroup.id,
  securityGroupId: ecsTaskSecurityGroup.id,
  description: "Allow HTTPS from anywhere"
});

export const albToHonoIngress = new aws.ec2.SecurityGroupRule("albToHonoIngress", {
  type: "ingress",
  fromPort: 3000,
  toPort: 3000,
  protocol: "tcp",
  sourceSecurityGroupId: albSecurityGroup.id,
  securityGroupId: ecsTaskSecurityGroup.id,
  description: "Allow Hono from anywhere"
});

export const albToEcsRuleEgress = new aws.ec2.SecurityGroupRule("AlbToEcsRuleEgress", {
  type: "egress",
  fromPort: 0,
  toPort: 0,
  protocol: "-1",
  securityGroupId: ecsTaskSecurityGroup.id,
  cidrBlocks: ["0.0.0.0/0"],
  description: "Allow all traffic to ALB"
});

//////// Security Group Rule コーディング ////////

// VPC情報をエクスポート
export const vpcInfo = {
  id: vpc.id,
  publicSubnets: vpc.publicSubnets,
  privateSubnets: vpc.privateSubnets
};

// セキュリティグループIDをエクスポート
export const ecsTaskSgId = ecsTaskSecurityGroup.id;
export const albSgId = albSecurityGroup.id;