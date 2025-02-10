import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

interface S3StackProps extends cdk.StackProps {
  projectName: string;
  envName: string;
}

export class S3Stack extends cdk.Stack {
  public readonly bucket: s3.Bucket;

  constructor(scope: Construct, id: string, props: S3StackProps) {
    super(scope, id, props);

    // バケット名を定義
    const bucketName = `${props.projectName}-bucket-${props.envName}`;

    // S3バケットの作成
    this.bucket = new s3.Bucket(this, bucketName, {
      // バケット名を指定
      bucketName: bucketName,
      
      // パブリックアクセスをブロック
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      
      // バージョニングを有効化
      versioned: true,
      
      // 暗号化を有効化
      encryption: s3.BucketEncryption.S3_MANAGED,

      // CFnスタック削除時に、バケットを保持する
      // removalPolicy: cdk.RemovalPolicy.RETAIN
      
      // バケットの削除方法を設定
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      // autoDeleteObjectsはREMOVAL_POLICYがDESTROYの場合のみ使用可能
      autoDeleteObjects: true,
    });
  }
}