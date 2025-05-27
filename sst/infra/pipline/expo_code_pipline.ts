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