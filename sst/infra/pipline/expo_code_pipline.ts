const idPrefix = "expo-code-pipeline";

// CodePipelineサービスロール
export const codePipelineExpoRole = new aws.iam.Role(
  `${idPrefix}-role-${process.env.SST_STAGE || "dev"}`,
  {
    name: `${idPrefix}-role-${process.env.SST_STAGE || "dev"}`,
    assumeRolePolicy: $jsonStringify({
      Version: "2012-10-17",
      Statement: [
        {
          Action: "sts:AssumeRole",
          Effect: "Allow",
          Principal: {
            Service: "codepipeline.amazonaws.com"
          }
        }
      ]
    }),
    inlinePolicies: [
      {
        name: `${idPrefix}-policy-${process.env.SST_STAGE || "dev"}`,
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

// アーティファクトストアバケット
export const artifactBucket = new sst.aws.Bucket(
  `${idPrefix}-artifact-store-${process.env.SST_STAGE || "dev"}`,
  {
    transform: {
      bucket: {
        bucket: `${idPrefix}-artifact-store-${process.env.SST_STAGE || "dev"}`,
        serverSideEncryptionConfigurations: [
          {
            rules: [
              {
                applyServerSideEncryptionByDefaults: [{
                  sseAlgorithm: "AES256"
                }],
                bucketKeyEnabled: true
              }
            ]
          }
        ]
      },
      policy: {
        bucket: `${idPrefix}-artifact-store-${process.env.SST_STAGE || "dev"}`,
        policy: $jsonStringify({
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Deny",
              Principal: "*",
              Action: "s3:*",
              Resource: [
                `arn:aws:s3:::${idPrefix}-artifact-store-${process.env.SST_STAGE || "dev"}`,
                `arn:aws:s3:::${idPrefix}-artifact-store-${process.env.SST_STAGE || "dev"}/*`
              ],
              Condition: {
                Bool: {
                  "aws:SecureTransport": "false"
                }
              }
            },
            {
              Effect: "Allow",
              Principal: {
                AWS: $interpolate`arn:aws:iam::235484765172:role/${codePipelineExpoRole.name}`
              },
              Action: [
                "s3:PutBucketPolicy",
                "s3:GetBucket*",
                "s3:List*",
                "s3:DeleteObject"
              ],
              Resource: [
                `arn:aws:s3:::${idPrefix}-artifact-store-${process.env.SST_STAGE || "dev"}`,
                `arn:aws:s3:::${idPrefix}-artifact-store-${process.env.SST_STAGE || "dev"}/*`
              ]
            }
          ]
        })
      }
    }
  }
);

// const expoCodeDeploy = new aws.codebuild.Project(
//   `${idPrefix}-${process.env.SST_STAGE || "dev"}`,
//   {
//     name: `${idPrefix}-${process.env.SST_STAGE || "dev"}`,
//     serviceRole: codeBuildExpoRole.arn,
//     artifacts: {
//       type: "CODEPIPELINE",
//     },
//     environment: {
//       computeType: "BUILD_GENERAL1_SMALL",
//       image: "aws/codebuild/amazonlinux2-x86_64-standard:3.0",
//       type: "ARM_CONTAINER",
//       environmentVariables: [
//         {
//           name: "region",
//           type: "PLAINTEXT",
//           value: "ap-northeast-1",
//         },
//         {
//           name: "stage",
//           type: "PLAINTEXT",
//           value: process.env.SST_STAGE || "dev",
//         }
//       ]
//     },
//     source: {
//       type: "CODEPIPELINE",
//       buildspec: "cicd/expo-deploy.yml"
//     }
//   }
// );

// const expoCodePipeline = new aws.codepipeline.Pipeline(
//   `${idPrefix}-${process.env.SST_STAGE || "dev"}`,
//   {
//     name: `${idPrefix}-${process.env.SST_STAGE || "dev"}`,
//     piplineType: "V2",
//     roleArn: codePipelineExpoRole.arn,
//     artifactStores: [
//       {
//         type: "S3",
//         location: artifactBucket.name,
//         // encryptionKey: {
//         //   id: artifactBucket.encryptionKey.id,
//         //   type: "KMS"
//         // }
//       }
//     ],
//     triggers: [
//       {
//         gitConfiguration: {
//           sourceActionName: "Source",
//           pushes: [
//             {
//               branches: {
//                 includes: ["main"]
//               },
//               filePaths: {
//                 includes: [
//                   "sst/cicd/**",
//                   "sst/infra/**"
//                 ],
//               },
//             },
//           ],
//         },
//         providerType: "CodeStarSourceConnection"
//       },
//     ],
//     stages: [
//       {
//         name: "Source",
//         actions: [
//           {
//             name: "Source",
//             category: "Source",
//             owner: "AWS",
//             provider: "CodeStarSourceConnection",
//             version: "1",
//             configuration: {
//               ConnectionArn: "arn:aws:codeconnections:ap-northeast-1:235484765172:connection/98eaf6f6-2b18-4045-86a9-dfae7734cb7d",
//               FullRepositoryId: "Syota0622/aws_web2",
//               BranchName: "main",
//             },
//             outputArtifacts: ["SourceArtifact"],
//           },
//         ],
//       },
//       {
//         name: "Deploy",
//         actions: [
//           {
//             name: "Deploy",
//             category: "Build",
//             owner: "AWS",
//             provider: "CodeBuild",
//             version: "1",
//             inputArtifacts: ["SourceArtifact"],
//             configuration: {
//               ProjectName: "expo-code-deploy"
//             },
//           },
//         ],
//       },
//     ],
//   },
// );

// // エクスポート用のオブジェクト
// export const expoCodePipelineExports = {
//   codePipelineExpoRole,
//   codeBuildExpoRole,
//   artifactBucket,
//   expoCodeDeploy,
//   expoCodePipeline,
// };