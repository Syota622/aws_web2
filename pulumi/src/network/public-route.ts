import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

// パブリックルートテーブルの引数を定義するインターフェース
export interface PublicRouteTableArgs {
    // ルートテーブルを作成するVPCのID（必須）
    vpcId: pulumi.Input<string>;
    
    // インターネットゲートウェイのID（必須）- パブリックルートに必要
    internetGatewayId: pulumi.Input<string>;
    
    // ルートテーブルに付けるタグ（任意）
    tags?: { [key: string]: string };
}

// パブリックルートテーブルを作成・管理するクラス
export class PublicRouteTable extends pulumi.ComponentResource {
    // このクラスのプロパティ
    public readonly routeTable: aws.ec2.RouteTable;
    public readonly internetRoute: aws.ec2.Route;
    public readonly associations: aws.ec2.RouteTableAssociation[] = [];

    constructor(name: string, args: PublicRouteTableArgs, opts?: pulumi.ComponentResourceOptions) {
        // 親クラスのコンストラクタを呼び出し
        super("custom:network:PublicRouteTable", name, {}, opts);

        // デフォルトのタグを準備
        const defaultTags = {
            Name: name,
            ManagedBy: "Pulumi",
            Type: "Public" // パブリックルートテーブルであることを明示
        };

        // タグをマージ
        const tags = { ...defaultTags, ...(args.tags || {}) };

        // パブリックルートテーブルリソースを作成
        this.routeTable = new aws.ec2.RouteTable(name, {
            vpcId: args.vpcId,  // どのVPCのルートテーブルか
            tags: tags,         // タグ情報
        }, { parent: this });   // 親リソースを指定

        // インターネットへのルートを自動的に追加（パブリックルートテーブルの特徴）
        this.internetRoute = new aws.ec2.Route(`${name}-internet`, {
            routeTableId: this.routeTable.id,        // このルートテーブルに追加
            destinationCidrBlock: "0.0.0.0/0",       // すべての外部トラフィック
            gatewayId: args.internetGatewayId,       // インターネットゲートウェイ経由
        }, { parent: this });

        // 出力を登録
        this.registerOutputs({
            routeTableId: this.routeTable.id,
            internetRouteId: this.internetRoute.id,
        });
    }

    // サブネットとルートテーブルを関連付けるメソッド
    public associateSubnet(subnetId: pulumi.Input<string>, name?: string): aws.ec2.RouteTableAssociation {
        // 関連付け名を生成
        // RouteTableリソースにはnameプロパティがないので、id属性を使用
        const associationName = name || `${name}-assoc-${this.associations.length + 1}`;
        
        // 関連付けリソースを作成
        const association = new aws.ec2.RouteTableAssociation(associationName, {
            routeTableId: this.routeTable.id,  // ルートテーブルID
            subnetId: subnetId,                // サブネットID
        }, { parent: this });  // 親はこのルートテーブルコンポーネント
        
        // 作成した関連付けを配列に追加
        this.associations.push(association);
        
        // 作成した関連付けを返す
        return association;
    }
}