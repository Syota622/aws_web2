import * as pulumi from "@pulumi/pulumi";
// src/networkディレクトリからまとめてインポート
// index.tsファイルでエクスポートされたものをここでインポート
import { Vpc, InternetGateway, PublicSubnet, PublicRouteTable } from "./src/network";

// 設定を取得
const config = new pulumi.Config();
// プロジェクト名を設定ファイルから取得（設定されていない場合はデフォルト値を使用）
const projectName = config.get("projectName") || "pulumi";

// 環境変数を取得（開発・テスト・本番など、設定されていない場合はdevを使用）
const env = config.get("environment") || "dev";

// 共通のタグ - すべてのリソースに付与する情報
const commonTags = {
    Project: projectName,
    Environment: env,
    ManagedBy: "Pulumi"
};

// リージョンの可用性ゾーン（AZ）- リソースを配置する場所
// 本来は動的に取得することも可能ですが、シンプルさのため直接指定
const availabilityZones = ["ap-northeast-1c", "ap-northeast-1d"];

// ========== VPC作成 ==========
// VPCは仮想ネットワークの基本単位
const mainVpc = new Vpc(`${projectName}-vpc-${env}`, {
    cidrBlock: "10.0.0.0/16",  // VPCのIPアドレス範囲
    tags: commonTags,
});

// ========== インターネットゲートウェイ作成 ==========
// インターネットゲートウェイはVPCとインターネットを接続
const mainIgw = new InternetGateway(`${projectName}-igw-${env}`, {
    vpcId: mainVpc.vpc.id,
    tags: commonTags,
});

// ========== パブリックサブネット作成 ==========
// パブリックサブネットは直接インターネットにアクセス可能
const publicSubnets: PublicSubnet[] = [];

// 2つのAZにパブリックサブネットを作成
for (let i = 0; i < 2; i++) {
    const az = availabilityZones[i];
    // 各サブネットに一意のCIDRブロックを割り当て
    const cidr = `10.0.${i}.0/24`;
    
    // パブリックサブネットを作成
    const subnet = new PublicSubnet(`${projectName}-public-subnet-${i+1}-${env}`, {
        vpcId: mainVpc.vpc.id,
        cidrBlock: cidr,
        availabilityZone: az,
        // パブリックIPを自動割り当て（パブリックサブネットの特徴）
        mapPublicIpOnLaunch: true,  
        tags: {
            ...commonTags,
            Name: `${projectName}-public-subnet-${i+1}-${env}`,
        },
    });
    
    // 作成したサブネットを配列に追加
    publicSubnets.push(subnet);
}

// ========== パブリックルートテーブル作成 ==========
// パブリックルートテーブルはインターネットへのルートを含む
const publicRouteTable = new PublicRouteTable(`${projectName}-public-rt-${env}`, {
    vpcId: mainVpc.vpc.id,
    // インターネットゲートウェイを指定（パブリックルートに必要）
    internetGatewayId: mainIgw.internetGateway.id,
    tags: commonTags,
});

// パブリックサブネットにルートテーブルを関連付け
for (let i = 0; i < publicSubnets.length; i++) {
    const subnet = publicSubnets[i];
    // 各サブネットとパブリックルートテーブルを関連づけ
    publicRouteTable.associateSubnet(
        subnet.subnet.id,
        `${projectName}-public-rt-assoc-${i+1}-${env}`
    );
}

// ========== 出力値の設定 ==========
// これらの値はpulumi stack outputコマンドで確認可能
export const vpcId = mainVpc.vpc.id;
export const vpcCidrBlock = mainVpc.vpc.cidrBlock;
export const internetGatewayId = mainIgw.internetGateway.id;
export const publicSubnetIds = publicSubnets.map(subnet => subnet.subnet.id);
export const publicRouteTableId = publicRouteTable.routeTable.id;