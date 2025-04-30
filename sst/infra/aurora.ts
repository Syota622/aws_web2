import { vpc } from "./vpc-network";

const postgres = new sst.aws.Aurora("MyDatabase", {
  engine: "postgres",
  scaling: {
    min: "1 ACU",
    max: "2 ACU"
  },
  vpc,
});
