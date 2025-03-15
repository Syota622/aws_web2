import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

// サブネットの引数を定義するインターフェース
// TypeScriptのインターフェースは、オブジェクトの形状（どんなプロパティを持つか）を定義します
export interface SubnetArgs {
    // VPCのID（必須）
    vpcId: pulumi.Input<string>;
    
    // サブネットのCIDRブロック（必須）- IPアドレス範囲を指定
    cidrBlock: string;
    
    // 利用可能ゾーン（必須）- リージョン内の特定のデータセンター
    availabilityZone: string;
    
    // パブリックIPを自動割り当てするかどうか（任意）
    // パブリックサブネットではtrueにします
    mapPublicIpOnLaunch?: boolean;
    
    // タグ（任意）- リソースに付けるラベル
    tags?: { [key: string]: string };
}

// サブネットを作成するクラス
// pulumi.ComponentResourceを継承して独自のカスタムリソースを定義
export class Subnet extends pulumi.ComponentResource {
    // このクラスのプロパティとしてサブネットリソースを公開
    public readonly subnet: aws.ec2.Subnet;

    // コンストラクタ - クラスのインスタンスを作成するときに呼ばれるメソッド
    constructor(name: string, args: SubnetArgs, opts?: pulumi.ComponentResourceOptions) {
        // 親クラスのコンストラクタを呼び出し、リソースタイプと名前を指定
        super("custom:network:Subnet", name, {}, opts);

        // デフォルトのタグを準備
        const defaultTags = {
            Name: name,
            ManagedBy: "Pulumi"
        };

        // ユーザー指定のタグとデフォルトタグをマージ
        // スプレッド構文（...）を使って、オブジェクトの内容を展開
        const tags = { ...defaultTags, ...(args.tags || {}) };

        // サブネットリソースを作成
        this.subnet = new aws.ec2.Subnet(name, {
            vpcId: args.vpcId,                           // どのVPCに属するか
            cidrBlock: args.cidrBlock,                   // IPアドレス範囲
            availabilityZone: args.availabilityZone,     // どのAZに配置するか
            mapPublicIpOnLaunch: args.mapPublicIpOnLaunch || false, // パブリックIP自動割り当て
            tags: tags,                                  // タグ情報
        }, { parent: this }); // このリソースの親は現在のコンポーネント

        // 出力を登録 - これによりpulumi upで出力が表示される
        this.registerOutputs({
            subnetId: this.subnet.id,       // サブネットID
            subnetArn: this.subnet.arn,     // サブネットのARN
            subnetCidr: this.subnet.cidrBlock, // サブネットのCIDR
        });
    }
}