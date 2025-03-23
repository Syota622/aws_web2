// SSTのグローバルオブジェクトを使用
export const vpc = new sst.aws.Vpc("MyVpc", {
  az: 3
});

// VPC情報をエクスポート
export const vpcInfo = {
  id: vpc.id,
  publicSubnets: vpc.publicSubnets,
  privateSubnets: vpc.privateSubnets
};