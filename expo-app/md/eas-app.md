- npx expo start
Expoの開発サーバーを起動するコマンド

- EXPO_NO_CAPABILITY_SYNC=1 eas build -p ios --profile development
Expoのビルドを行うコマンド

- eas build:list --platform ios
ビルドの一覧を表示するコマンド

- EXPO_NO_CAPABILITY_SYNC=1 eas build:list --platform ios --profile development
環境ごとのビルドの一覧を表示するコマンド

- EXPO_NO_CAPABILITY_SYNC=1 eas build --platform ios --profile production
TestFlightに提出するためのビルドを作成するコマンド

- eas build --platform ios --profile production --non-interactive
非対話でビルドを実施するコマンド

- eas submit --platform ios --latest
TestFlightに提出するコマンド

- eas submit --platform ios --latest --non-interactive
非対話でTestFlightに提出するコマンド

- eas build --platform ios --profile production --non-interactive --auto-submit
非対話でビルドした後に、TestFlightに提出するコマンド

- eas submit --platform ios --id 9d0ad703-31f0-4cc0-9be7-0b11a2722d5a
TestFlight提出時に対象のidを指定するコマンド

- eas build:list --platform ios --limit 10
ビルドの一覧を表示するコマンド

- rm -rf ~/.app-store/auth/
- eas credentials --platform ios
Apple認証情報のクリア