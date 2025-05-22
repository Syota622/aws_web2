# Cognito
## ユーザープールの一覧を取得
aws cognito-idp list-user-pools --max-results 20

## 特定のユーザープール情報を取得（USER_POOL_IDは実際のIDに置き換え）
aws cognito-idp describe-user-pool --user-pool-id YOUR_USER_POOL_ID

## 管理者権限でユーザーを作成
aws cognito-idp admin-create-user \
  --user-pool-id YOUR_USER_POOL_ID \
  --username user@example.com \
  --temporary-password Temp123! \
  --user-attributes Name=email,Value=user@example.com Name=email_verified,Value=true \
  --message-action SUPPRESS

## 初回サインイン（一時パスワードから永続的パスワードに変更）
aws cognito-idp admin-initiate-auth \
  --user-pool-id YOUR_USER_POOL_ID \
  --client-id YOUR_CLIENT_ID \
  --auth-flow ADMIN_USER_PASSWORD_AUTH \
  --auth-parameters USERNAME=user@example.com,PASSWORD=Temp123!

## レスポンスからChallengeNameとSessionを取得し、以下のコマンドで新しいパスワードを設定
aws cognito-idp admin-respond-to-auth-challenge \
  --user-pool-id YOUR_USER_POOL_ID \
  --client-id YOUR_CLIENT_ID \
  --challenge-name NEW_PASSWORD_REQUIRED \
  --challenge-responses USERNAME=user@example.com,NEW_PASSWORD=NewPassword123! \
  --session YOUR_SESSION_STRING

## ユーザー認証
aws cognito-idp admin-initiate-auth \
  --user-pool-id YOUR_USER_POOL_ID \
  --client-id YOUR_CLIENT_ID \
  --auth-flow ADMIN_USER_PASSWORD_AUTH \
  --auth-parameters USERNAME=user@example.com,PASSWORD=NewPassword123!

# ソーシャルプロバイダーと外部プロバイダーの注意点
aws:cognito/identityProvider:IdentityProvider resource 'SignInWithAppleIdentityProvider' has a problem: expected provider_type to be one of ["SAML" "Facebook" "Google" "LoginWithAmazon" "SignInWithApple" "OIDC"], got Apple. Examine values at 'SignInWithAppleIdentityProvider.providerType'.