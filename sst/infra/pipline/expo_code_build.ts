const idPrefix = "expo-code-pipeline";

// CodeBuildサービスロール
export const codeBuildExpoRole = new aws.iam.Role(
  `${idPrefix}-build-role-${process.env.SST_STAGE || "dev"}`,
  {
    name: `${idPrefix}-build-role-${process.env.SST_STAGE || "dev"}`,
    assumeRolePolicy: $jsonStringify({
      Version: "2012-10-17",
      Statement: [
        {
          Action: "sts:AssumeRole",
          Effect: "Allow",
          Principal: {
            Service: "codebuild.amazonaws.com"
          }
        }
      ]
    }),
    inlinePolicies: [
      {
        name: `${idPrefix}-build-policy-${process.env.SST_STAGE || "dev"}`,
        policy: $jsonStringify({
          Version: "2012-10-17",
          Statement: [
            {
              Action: ["*"],
              Effect: "Allow",
              Resource: ["*"]
            }
          ]
        })
      }
    ]
  }
);

// CodeBuildプロジェクト
export const expoCodeDeploy = new aws.codebuild.Project(
  `${idPrefix}-${process.env.SST_STAGE || "dev"}`,
  {
    name: `${idPrefix}-${process.env.SST_STAGE || "dev"}`,
    serviceRole: codeBuildExpoRole.arn,
    artifacts: {
      type: "CODEPIPELINE",
    },
    environment: {
      computeType: "BUILD_GENERAL1_SMALL",
      image: "aws/codebuild/amazonlinux2-aarch64-standard:3.0",
      type: "ARM_CONTAINER",
      environmentVariables: [
        {
          name: "region",
          type: "PLAINTEXT",
          value: "ap-northeast-1",
        },
        {
          name: "stage",
          type: "PLAINTEXT",
          value: process.env.SST_STAGE || "dev",
        }
      ]
    },
    source: {
      type: "CODEPIPELINE",
      buildspec: "cicd/expo-deploy.yml"
    }
  }
);
