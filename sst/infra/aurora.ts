import { vpc, auroraPostgresSecurityGroup } from "./vpc-network";

const idPrefix = "my-app";

const postgres = new sst.aws.Aurora(
  `${idPrefix}-postgres`, 
  {
    engine: "postgres",
    scaling: {
      min: "1 ACU",
      max: "2 ACU"
    },
    replicas: 1,
    vpc: {
      subnets: vpc.privateSubnets,
      securityGroups: [auroraPostgresSecurityGroup]
    },
    transform: {
      cluster: {
        backupRetentionPeriod: 3 // バックアップを3日間保持
      }
    }
  }
);
