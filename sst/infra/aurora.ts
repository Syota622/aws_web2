import { vpc } from "./vpc-network";

const postgres = new sst.aws.Aurora("MyDatabase", {
  engine: "postgres",
  scaling: {
    min: "1 ACU",
    max: "2 ACU"
  },
  vpc,
  // username: "postgres", // ユーザー名（直接指定する場合）
  // password: "mypassword", // パスワード（直接指定する場合）
});

// const aurora = new sst.aws.Postgres.v1("MyCluster",
//   vpc: {
//     privateSubnets
//   }
// )