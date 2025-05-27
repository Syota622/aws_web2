import { userPool } from "./user-pool";
import { appleParameterNames } from "../parameter_store/apple-provider-params"; 

// AWS Parameter Storeから直接値を取得
const clientId = aws.ssm.getParameterOutput({
  name: appleParameterNames.clientIdName,
  withDecryption: true,
});

const teamId = aws.ssm.getParameterOutput({
  name: appleParameterNames.teamIdName,
  withDecryption: true,
});

const keyId = aws.ssm.getParameterOutput({
  name: appleParameterNames.keyIdName,
  withDecryption: true,
});

const privateKey = aws.ssm.getParameterOutput({
  name: appleParameterNames.privateKeyName,
  withDecryption: true,
});

// // Apple IDプロバイダーの設定（コーディング方法が色々ある）
// export const appleIdentityProvider = new aws.cognito.IdentityProvider("AppleIdentityProvider", {
//   userPoolId: userPool.id,
//   providerName: "SignInWithApple",
//   providerType: "SignInWithApple",
//   providerDetails: {
//     client_id: clientId.value,
//     team_id: teamId.value,
//     key_id: keyId.value,
//     private_key: privateKey.value,
//     authorize_scopes: "name email"
//   },
//   attributeMapping: {
//     email: "email",
//     given_name: "firstName",
//     family_name: "lastName",
//     username: "sub"
//   }
// });

// プロバイダー名をエクスポート（コーディング方法が色々ある）
export const appleIdentityProvider = userPool.addIdentityProvider(
  `apple-provider-signin-with-apple-${process.env.SST_STAGE || 'dev'}`,
  {
    type: "apple",
    details: {
      client_id: clientId.value,
      team_id: teamId.value,
      key_id: keyId.value,
      private_key: privateKey.value,
      authorize_scopes: "profile name email"
    },
    attributes: {
      email: "email",
      name: "name",
      picture: "picture",
    },
    transform: {
      identityProvider: {
        providerName: "SignInWithApple",
        providerType: "SignInWithApple",
        userPoolId: userPool.id,
        providerDetails: {
          client_id: clientId.value,
          team_id: teamId.value,
          key_id: keyId.value,
          private_key: privateKey.value,
          authorize_scopes: "profile name email"
        }
      }
    }
  }
);

// プロバイダー名をエクスポート
export const appleProviderName = appleIdentityProvider.providerName;
