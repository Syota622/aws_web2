import * as cdk from 'aws-cdk-lib';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';

interface CloudFrontStack2Props extends cdk.StackProps {
  projectName: string;
  envName: string;
  websiteBucket: s3.Bucket;
  api: apigateway.RestApi;
}

export class CloudFrontStack2 extends cdk.Stack {
  public readonly distribution: cloudfront.Distribution;

  constructor(scope: Construct, id: string, props: CloudFrontStack2Props) {
    super(scope, id, props);

    // カスタムオリジンリクエストポリシーの作成
    const apiOriginRequestPolicy = new cloudfront.OriginRequestPolicy(this, 'ApiOriginRequestPolicy', {
      originRequestPolicyName: `${props.projectName}-${props.envName}-api-policy2`,
      headerBehavior: cloudfront.OriginRequestHeaderBehavior.none(),
      queryStringBehavior: cloudfront.OriginRequestQueryStringBehavior.all(),
    });

    // APIエンドポイントとS3のオリジンを作成
    const apiOrigin = new origins.RestApiOrigin(props.api, {
      originPath: `/${props.envName}`  // ステージ名を追加
    });
    const s3Origin = new origins.S3Origin(props.websiteBucket);

    this.distribution = new cloudfront.Distribution(this, `cf-${props.projectName}-${props.envName}`, {
      // デフォルトをAPI Gateway向けに変更
      defaultBehavior: {
        origin: apiOrigin,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.HTTPS_ONLY,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
        cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
        originRequestPolicy: apiOriginRequestPolicy,
      },
      // S3向けの特定パターンを追加
      additionalBehaviors: {
        '*.html': {
          origin: s3Origin,
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
          cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD,
        }
      }
    });

    new cdk.CfnOutput(this, 'DistributionDomainName', {
      value: this.distribution.distributionDomainName,
      description: 'CloudFront Distribution Domain Name',
    });
  }
}