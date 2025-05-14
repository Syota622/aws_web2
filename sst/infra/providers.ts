// 大阪リージョンのプロバイダーを定義
export const osakaProvider = new aws.Provider(
  "osaka-provider", 
  {
  region: "ap-northeast-3" // 大阪リージョン（関西リージョン）
  }
);