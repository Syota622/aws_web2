- npx expo start
Expoの開発サーバーを起動するコマンド

- EXPO_NO_CAPABILITY_SYNC=1 eas build -p ios --profile development
Expoのビルドを行うコマンド

- eas build:list --platform ios
ビルドの一覧を表示するコマンド

- EXPO_NO_CAPABILITY_SYNC=1 eas build:list --platform ios --profile development
環境ごとのビルドの一覧を表示するコマンド

- EXPO_NO_CAPABILITY_SYNC=1 eas build --platform ios --profile production
- eas submit --platform ios --latest
