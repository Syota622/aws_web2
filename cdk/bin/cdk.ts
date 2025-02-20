#!/usr/bin/env node
import 'source-map-support/register';
import * as dotenv from 'dotenv';
import * as cdk from 'aws-cdk-lib';
import { VpcStack } from '../lib/stacks/vpc-stack';
import { S3Stack } from '../lib/stacks/s3-stack';
import { ApiStack } from '../lib/stacks/api-stack';
import { CloudFrontStack } from '../lib/stacks/cloudfront-stack';
import { CloudFrontStack2 } from '../lib/stacks/cloudfront-stack2';

dotenv.config();

const app = new cdk.App();

const projectName = process.env.PROJECT_NAME || 'learn';
const envName = process.env.ENV_NAME || 'prod';

const commonProps = {
  projectName,
  envName,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
};

const vpcStack = new VpcStack(app, `VpcStack-${projectName}-${envName}`, commonProps);
const s3Stack = new S3Stack(app, `S3Stack-${projectName}-${envName}`, commonProps);
const apiStack = new ApiStack(app, `ApiStack-${projectName}-${envName}`, commonProps);

// CloudFrontスタックに必要な依存リソースを渡す
new CloudFrontStack(app, `CloudFrontStack-${projectName}-${envName}`, {
  ...commonProps,
  websiteBucket: s3Stack.bucket,
  api: apiStack.api,
});

new CloudFrontStack2(app, `CloudFrontStack2-${projectName}-${envName}`, {
  ...commonProps,
  websiteBucket: s3Stack.bucket,
  api: apiStack.api,
});
