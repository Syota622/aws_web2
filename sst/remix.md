# SST remix
✓ built in 135ms
|  Created     AwsProvider sst:ap-northeast-1
|  Created     MyWeb sst:aws:Remix → MyWebKvKeys sst:aws:KvKeys
|  Created     MyWeb sst:aws:Remix → MyWebServerApnortheast1 sst:aws:Function
|  Created     MyWeb sst:aws:Remix → MyWebAssetFiles sst:aws:BucketFiles
|  Created     MyWeb sst:aws:Remix → MyWebServerApnortheast1 sst:aws:Function
|  Created     MyWeb sst:aws:Remix → MyWebInvalidation sst:aws:DistributionInvalidation
|  Created     MyWeb sst:aws:Remix → MyWebServerApnortheast1LogGroup aws:cloudwatch:LogGroup
|  Created     MyWeb sst:aws:Remix → MyWebServerApnortheast1Role aws:iam:Role
|  Created     MyWeb sst:aws:Remix (19.6s)
|  Created     MyWeb sst:aws:Remix → MyWebServerApnortheast1Url aws:lambda:FunctionUrl

↗  Permalink   https://sst.dev/u/600b20df

✓  Generated    
   MyApi: https://dw7fm5dxjfgkqigmaqlhcxhyfu0fmqcu.lambda-url.ap-northeast-1.on.aws/
   ---
   ClusterId: arn:aws:ecs:ap-northeast-1:235484765172:cluster/MyCustomECSCluster
   MyBucket: sst-dev-newcreatemybucketbucket-ktfvaokw
   PrivateSubnets: [subnet-0d0fb8af83643e62f subnet-0600de614ee4a850d subnet-0e92b32b4ac591bfe]
   PublicSubnets: [subnet-08c0f0cbd13ea9917 subnet-046f186ce994a51be subnet-0e9b626b64b81c647]
   UserPoolClientId: 9a4tt079fvriqcdrf8rkiq3p1
   UserPoolId: ap-northeast-1_VzMFif496
   VpcId: vpc-0d09e22fdfca567bc

+  MyWebLinkRef sst:sst:LinkRef

+  MyWeb sst:aws:Remix

+  MyWeb sst:aws:Remix → MyWebCdn sst:aws:CDN

+  MyWeb sst:aws:Remix → MyWebAssets sst:aws:Bucket

+  MyWeb sst:aws:Remix → MyWebCdn sst:aws:CDN

+  MyWeb sst:aws:Remix → MyWebKvStore aws:cloudfront:KeyValueStore

+  MyWeb sst:aws:Remix → MyWebServerCachePolicy aws:cloudfront:CachePolicy

+  default_1_0_1 pulumi:providers:command

+  MyWeb sst:aws:Remix → MyWebAssets sst:aws:Bucket

+  MyWeb sst:aws:Remix → MyWebBuilder command:local:Command

+  MyWeb sst:aws:Remix → MyWebAssetsBucket aws:s3:BucketV2

+  MyWeb sst:aws:Remix → MyWebCloudfrontFunctionRequest aws:cloudfront:Function

+  MyWeb sst:aws:Remix → MyWebAssetsPublicAccessBlock aws:s3:BucketPublicAccessBlock

+  MyWeb sst:aws:Remix → MyWebAssetsCors aws:s3:BucketCorsConfigurationV2

+  MyWeb sst:aws:Remix → MyWebCdnDistribution aws:cloudfront:Distribution

+  MyWeb sst:aws:Remix → MyWebAssetsPolicy aws:s3:BucketPolicy

+  MyWebLinkRef sst:sst:LinkRef

+  default pulumi:providers:pulumi-nodejs

+  MyWeb sst:aws:Remix → MyWebCdnWaiter sst:aws:DistributionDeploymentWaiter

+  AwsProvider sst:ap-northeast-1

+  MyWeb sst:aws:Remix → MyWebKvKeys sst:aws:KvKeys

+  MyWeb sst:aws:Remix → MyWebServerApnortheast1 sst:aws:Function

+  MyWeb sst:aws:Remix → MyWebAssetFiles sst:aws:BucketFiles

+  MyWeb sst:aws:Remix → MyWebServerApnortheast1 sst:aws:Function

+  MyWeb sst:aws:Remix → MyWebInvalidation sst:aws:DistributionInvalidation

+  MyWeb sst:aws:Remix → MyWebServerApnortheast1LogGroup aws:cloudwatch:LogGroup

+  MyWeb sst:aws:Remix → MyWebServerApnortheast1Role aws:iam:Role

+  MyWeb sst:aws:Remix

+  MyWeb sst:aws:Remix → MyWebServerApnortheast1Url aws:lambda:FunctionUrl