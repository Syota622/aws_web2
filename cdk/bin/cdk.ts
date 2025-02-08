#!/usr/bin/env node
import 'source-map-support/register';
import * as dotenv from 'dotenv';
import * as cdk from 'aws-cdk-lib';
import { VpcStack } from '../lib/stacks/vpc-stack';

// .envファイルの読み込み
dotenv.config();

const app = new cdk.App();

const projectName = process.env.PROJECT_NAME || 'learn';
const envName = process.env.ENV_NAME || 'prod';

// CloudFormationスタック作成
new VpcStack(app, `VpcStack-${projectName}-${envName}`, {
  projectName,
  envName,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
