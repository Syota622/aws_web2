import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

// ルートテーブルの引数を定義するインターフェース
export interface RouteTableArgs {
    // ルートテーブルを作成するVPCのID（必須）
    vpcId: pulumi.Input<string>;
    
    // ルートテーブルに付けるタグ（任意）
    tags?: { [key: string]: string };
}

// ルートの引数を定義するインターフェース
export interface RouteArgs {
    // ルートテーブルのID（必須）
    routeTableId: pulumi.Input<string>;
    
    // 宛先のCIDRブロック（必須）- どの宛先に向かうトラフィックかを指定
    destinationCidrBlock: string;
    
    // 以下は宛先タイプによって1つだけ指定（任意だが、いずれか1つは必要）
    
    // インターネットゲートウェイID - インターネットへの接続用
    gatewayId?: pulumi.Input<string>;
    
    // NATゲートウェイID - プライベートサブネットからインターネットへの接続用
    natGatewayId?: pulumi.Input<string>;
}

// ルートテーブルの関連付け用の引数インターフェース
export interface RouteTableAssociationArgs {
    // ルートテーブルのID（必須）
    routeTableId: pulumi.Input<string>;
    
    // 関連付けるサブネットのID（必須）
    subnetId: pulumi.Input<string>;
}

// ルートテーブルを作成・管理するクラス
export class RouteTable extends pulumi.ComponentResource {
    // このクラスのプロパティ
    public readonly routeTable: aws.ec2.RouteTable;
    public readonly routes: aws.ec2.Route[] = [];
    public readonly associations: aws.ec2.RouteTableAssociation[] = [];

    constructor(name: string, args: RouteTableArgs, opts?: pulumi.ComponentResourceOptions) {
        // 親クラスのコンストラクタを呼び出し
        super("custom:network:RouteTable", name, {}, opts);

        // デフォルトのタグを準備
        const defaultTags = {
            Name: name,
            ManagedBy: "Pulumi"
        };

        // タグをマージ
        const tags = { ...defaultTags, ...(args.tags || {}) };

        // ルートテーブルリソースを作成
        this.routeTable = new aws.ec2.RouteTable(name, {
            vpcId: args.vpcId,  // どのVPCのルートテーブルか
            tags: tags,         // タグ情報
        }, { parent: this });   // 親リソースを指定

        // 出力を登録
        this.registerOutputs({
            routeTableId: this.routeTable.id,
        });
    }

    // ルートを追加するメソッド
    public addRoute(name: string, args: RouteArgs): aws.ec2.Route {
        // ルート名に親リソース名を追加して一意にする
        const routeName = `${this.routeTable.name}-${name}`;
        
        // ルートを作成
        const route = new aws.ec2.Route(routeName, {
            routeTableId: args.routeTableId,           // どのルートテーブルに追加するか
            destinationCidrBlock: args.destinationCidrBlock, // 宛先のCIDRブロック
            gatewayId: args.gatewayId,                 // インターネットゲートウェイID（指定された場合）
            natGatewayId: args.natGatewayId,           // NATゲートウェイID（指定された場合）
        }, { parent: this });   // 親はこのルートテーブルコンポーネント
        
        // 作成したルートを配列に追加
        this.routes.push(route);
        
        // 作成したルートを返す
        return route;
    }

    // サブネットとルートテーブルを関連付けるメソッド
    public associate(name: string, args: RouteTableAssociationArgs): aws.ec2.RouteTableAssociation {
        // 関連付け名に親リソース名を追加して一意にする
        const associationName = `${this.routeTable.name}-${name}`;
        
        // 関連付けリソースを作成
        const association = new aws.ec2.RouteTableAssociation(associationName, {
            routeTableId: args.routeTableId,  // ルートテーブルID
            subnetId: args.subnetId,          // サブネットID
        }, { parent: this });  // 親はこのルートテーブルコンポーネント
        
        // 作成した関連付けを配列に追加
        this.associations.push(association);
        
        // 作成した関連付けを返す
        return association;
    }
}