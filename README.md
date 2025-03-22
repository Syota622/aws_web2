# aws_web2

# SST
- git clone https://github.com/sst-example/sst-example.git
  - https://sst.dev/docs/set-up-a-monorepo/
- npx replace-in-file '/monorepo-template/g' 'sst' '**/*.*' --verbose

```sh
% npx replace-in-file '/monorepo-template/g' 'sst' '**/*.*' --verbose
Need to install the following packages:
replace-in-file@8.3.0
Ok to proceed? (y) y

Replacing '/monorepo-template/g' with 'sst'
8 file(s) were changed
- sst.config.ts
- package.json
- README.md
- packages/scripts/package.json
- packages/scripts/src/example.ts
- packages/functions/package.json
- packages/functions/src/api.ts
- packages/core/package.json
```

- cd sst-example
- npm install
- npx sst deploy --stage dev
```sh
% npx sst deploy --stage dev
SST 3.10.0  ready!

➜  App:        sst
   Stage:      dev

~  Deploy

|  Created     default_4_16_6 pulumi:providers:random
|  Created     MyBucket sst:aws:Bucket
|  Created     default_6_66_2 pulumi:providers:aws
|  Created     LambdaEncryptionKey random:index:RandomBytes
|  Created     MyApi sst:aws:Function → MyApiLogGroup aws:cloudwatch:LogGroup
|  Created     MyBucket sst:aws:Bucket → MyBucketBucket aws:s3:BucketV2 (2.1s)
|  Created     MyBucket sst:aws:Bucket → MyBucketPublicAccessBlock aws:s3:BucketPublicAccessBlock
|  Created     MyBucket sst:aws:Bucket → MyBucketCors aws:s3:BucketCorsConfigurationV2
|  Created     MyApi sst:aws:Function → MyApiSourcemap0 aws:s3:BucketObjectv2
|  Created     MyApi sst:aws:Function → MyApiCode aws:s3:BucketObjectv2
|  Created     MyBucket sst:aws:Bucket → MyBucketPolicy aws:s3:BucketPolicy
|  Created     MyApi sst:aws:Function → MyApiRole aws:iam:Role (2.3s)
|  Created     MyApi sst:aws:Function → MyApiFunction aws:lambda:Function (14.8s)
|  Created     MyApi sst:aws:Function → MyApiUrl aws:lambda:FunctionUrl
|  Created     MyApi sst:aws:Function (32.6s)

↗  Permalink   https://sst.dev/u/84fd4a77

✓  Complete    
   MyApi: https://dw7fm5dxjfgkqigmaqlhcxhyfu0fmqcu.lambda-url.ap-northeast-1.on.aws/
   ---
   MyBucket: sst-dev-mybucketbucket-mubkbbrr
```

- npx sst diff --stage dev
- npx sst remove --stage dev
- npx sst runlock
