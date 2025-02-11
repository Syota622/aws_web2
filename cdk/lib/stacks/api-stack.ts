import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';

interface ApiStackProps extends cdk.StackProps {
  projectName: string;
  envName: string;
}

export class ApiStack extends cdk.Stack {
  public readonly api: apigateway.RestApi;

  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    // REST APIの作成
    this.api = new apigateway.RestApi(this, `api-${props.projectName}-${props.envName}`, {
      restApiName: `api-${props.projectName}-${props.envName}`,
      description: 'Test API Gateway',
      deployOptions: {
        stageName: props.envName,
      },
      // CORSの設定
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key'],
      },
    });

    // /test エンドポイントの作成
    const testResource = this.api.root.addResource('test');
    
    // GET メソッドの追加
    testResource.addMethod('GET', new apigateway.MockIntegration({
      integrationResponses: [{
        statusCode: '200',
        responseTemplates: {
          'application/json': JSON.stringify({
            message: 'Hello from API Gateway!',
            timestamp: '$context.requestTime'
          })
        },
      }],
      requestTemplates: {
        'application/json': '{ "statusCode": 200 }'
      }
    }), {
      methodResponses: [{
        statusCode: '200',
        responseModels: {
          'application/json': apigateway.Model.EMPTY_MODEL,
        },
      }]
    });

    // APIのURLを出力
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: this.api.url,
      description: 'API Gateway URL'
    });
  }
}