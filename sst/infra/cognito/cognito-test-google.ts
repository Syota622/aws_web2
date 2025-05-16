import { vpc } from "../vpc-network";
import { postgres } from "../aurora";
const idPrefix = "my-app-users";

const securityGroup = new aws.ec2.SecurityGroup(
  `${idPrefix}-security-group`,
  {
    name: `${idPrefix}-security-group`,
    description: "Security group for my app",
    vpcId: vpc.vpc.id,
    ingress: [
      {
        fromPort: 443,
        toPort: 443,
        protocol: "tcp",
        cidrBlocks: ["0.0.0.0/0"],
        description: "Allow HTTPS from anywhere",
      },
    ],
    egress: [
      {
        fromPort: 5432,
        toPort: 5432,
        protocol: "tcp",
        cidrBlocks: ["0.0.0.0/0"],
        description: "Allow Postgres from anywhere",
      },
    ],
  },
);

// RDS Proxy
new awslambda.ec2.SecurityGroupRule(
  `${idPrefix}-rds-rule`,
  {
    securityGroupId: securityGroup.id,
    type: "ingress",
    fromPort: 5432,
    toPort: 5432,
    protocol: "tcp",
    cidrBlocks: ["0.0.0.0/0"],
    description: "Allow Postgres from anywhere",
  }
)

// RDS
new aws.ec2.SecurityGroupRule(
  `${idPrefix}-rds-rule`,
  {
    securityGroupId: securityGroup.id,
    type: "ingress",
    fromPort: 5432,
    toPort: 5432,
    protocol: "tcp",
    cidrBlocks: ["0.0.0.0/0"],
    description: "Allow Postgres from anywhere",
  }
)

// User Pool
const userPool = new sst.aws.CognitoUserPool(
  `${idPrefix}-user-pool`,
  {
    triggers: {
      postConfirmation: {
        name: `${idPrefix}-post-confirmation`,
        handler: "packages/functions/src/post-confirmation.handler",
        timeout: 30,
        link :[
          postgres.dbInstance.arn,
        ],
        vpc: {
          securityGroups: [securityGroup],
          privateSubnets: vpc.privateSubnets,
        },
        environment: {
          variables: {
            DB_HOST: postgres.dbInstance.endpoint,
            DB_NAME: postgres.dbInstance.dbName,
            DB_USER: postgres.dbInstance.dbUser,
            DB_PASSWORD: postgres.dbInstance.dbPassword,
          },
        },
      },
    },
    transform: {
      userPool: {
        name: `${idPrefix}-user-pool`,
        tags: {
          Project: "my-app",
        },
      },
    },
  },
);

const googleClientId = new sst.Secret("GOOGLE_CLIENT_ID").value;
const googleClientSecret = new sst.Secret("GOOGLE_CLIENT_SECRET").value;

// Idp
const idp = userPool.addIdentityProvider(
  `${idPrefix}-google`,
  {
    type: "google",
    details: {
      authorization_scope: "email profile",
      client_id: googleClientId,
      client_secret: googleClientSecret,
      attributes: {
        email: ["email"],
        name: ["name"],
        picture: ["picture"],
      },
      transform: {
        identityProvider: {
          providerName: "Google",
          providerType: "Google",
          userPoolId: userPool.userPool.id,
          providerDetails: {
            authorization_scope: "email profile",
            client_id: googleClientId,
            client_secret: googleClientSecret,
          },
        },
      },
    },
  },
);

const userPoolClient = userPool.addClient(
  `${idPrefix}-client`,
  {
    provider: ["Google"],
    transform: {
      client: {
        supportedIdentityProviders: ["Google"],
        callbackUrls: ["https://my-app.com/callback"],
        logoutUrls: ["https://my-app.com/logout"],
        authSessionValidity: 1,
        accessTokenValidity: 1,
        refreshTokenValidity: 1,
        idTokenValidity: 1,
        tokenValidityUnits: {
          accessToken: "days",
          idToken: "days",
          refreshToken: "days",
        },
        explicitAuthFlows: [
          "ALLOW_USER_SRP_AUTH",
          "ALLOW_USER_PASSWORD_AUTH",
          "ALLOW_REFRESH_TOKEN_AUTH",
        ],
      },
    },
  },
);

const idPool = new sst.aws.CognitoIdentityPool(
  `${idPrefix}-id-pool`,
  {
    userPools: [
      {
        userPool: userPool.id,
        client: userPoolClient.id,
      },
    ],
    transform: {
      identityPool: {
        name: `${idPrefix}-id-pool`,
        
      }
    }
  },
);

export const cognito = {
  userPool,
  userPoolClient,
  idPool,
  idp,
};
