#!/usr/bin/env node
import 'source-map-support/register';
import * as dotenv from 'dotenv';
import * as cdk from 'aws-cdk-lib';
import { VpcStack } from '../lib/stacks/vpc-stack';
import { S3Stack } from '../lib/stacks/s3-stack';
import { ApiStack } from '../lib/stacks/api-stack';

// .envファイルの読み込み
dotenv.config();

const app = new cdk.App();

const projectName = process.env.PROJECT_NAME || 'learn';
const envName = process.env.ENV_NAME || 'prod';

// CloudFormationスタック作成
// VpcStack-learn-prodが、スタック名となる
new VpcStack(app, `VpcStack-${projectName}-${envName}`, {
  projectName,
  envName,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});

// S3スタック
new S3Stack(app, `S3Stack-${projectName}-${envName}`, {
  projectName,
  envName,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});

new ApiStack(app, `ApiStack-${projectName}-${envName}`, {
  projectName,
  envName,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
