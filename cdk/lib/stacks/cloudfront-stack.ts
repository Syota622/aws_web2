// import * as cdk from 'aws-cdk-lib';
// import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
// import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
// import * as s3 from 'aws-cdk-lib/aws-s3';
// import * as apigateway from 'aws-cdk-lib/aws-apigateway';
// import { Construct } from 'constructs';

// // CloudFrontStackPropsは、CloudFrontStackのプロパティを定義するインターフェース
// interface CloudFrontStackProps extends cdk.StackProps {
//   projectName: string;
//   envName: string;
//   websiteBucket: s3.Bucket;
//   api: apigateway.RestApi;
// }

// export class CloudFrontStack extends cdk.Stack {
//   public readonly distribution: cloudfront.Distribution;

//   constructor(scope: Construct, id: string, props: CloudFrontStackProps) {
//     super(scope, id, props);

//     // CloudFront Distributionの作成
//     this.distribution = new cloudfront.Distribution(this, `cf-${props.projectName}-${props.envName}`, {
//       defaultBehavior: {
//         origin: new origins.S3Origin(props.websiteBucket),
//         viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
//         allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
//         cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD,
//       },
//       additionalBehaviors: {
//         '/prod/*': {
//           origin: new origins.RestApiOrigin(props.api),
//           viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.HTTPS_ONLY,
//           allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
//           cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD,
//         }
//       },
//       defaultRootObject: 'index.html',
//       errorResponses: [
//         {
//           httpStatus: 403,
//           responseHttpStatus: 200,
//           responsePagePath: '/index.html',
//         },
//         {
//           httpStatus: 404,
//           responseHttpStatus: 200,
//           responsePagePath: '/index.html',
//         },
//       ],
//     });

//     // CloudFront URLを出力
//     new cdk.CfnOutput(this, 'DistributionDomainName', {
//       value: this.distribution.distributionDomainName,
//       description: 'CloudFront Distribution Domain Name',
//     });
//   }
// }