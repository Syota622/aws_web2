const idPrefix = "expo-code-build"

// CodeBuildサービスロール
export const codeBuildExpoRole = new aws.iam.Role(
  `${idPrefix}-role-${process.env.SST_STAGE || "dev"}`,
  {
    name: `${idPrefix}-role-${process.env.SST_STAGE || "dev"}`,
    assumeRolePolicy: JSON.stringify({
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
        name: `${idPrefix}-policy-${process.env.SST_STAGE || "dev"}`,
        policy: JSON.stringify({
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

// export const expoCodeBuild = new aws.codebuild.Project(
//   `${idPrefix}-${process.env.SST_STAGE || "dev"}`,
//   {
//     name: `${idPrefix}-${process.env.SST_STAGE || "dev"}`,
//     source: {
//       type: "CODEPIPELINE",
//     }
//   }
// )