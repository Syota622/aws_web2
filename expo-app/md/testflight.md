# TestFlight

## なぜTestFlightにproductionビルドが必要なのか

TestFlightでは**App Storeと同じ配信プロセス**を使用するため、以下の理由でproductionビルドが必要です：

1. **署名方式の違い**
   - developmentビルド：特定のデバイスのみで動作（Ad Hoc配信）
   - productionビルド：App Store/TestFlight配信用の署名

2. **配信方法の違い**
   - developmentビルド：デバイスを事前登録して直接インストール
   - productionビルド：TestFlight/App Store経由で配信

3. **Expoでの使い分け**
   - `development`：Expo Goや開発用ビルド
   - `preview`：内部テスト用（Ad Hoc）
   - `production`：TestFlight/App Store用

## 公式ドキュメント

## 公式ドキュメントのURL

### Expo公式ドキュメント

1. **EAS Build設定について**（profileの説明）：
   https://docs.expo.dev/build/eas-json/

2. **iOS Production Buildの作成**（TestFlightの説明含む）：
   https://docs.expo.dev/tutorial/eas/ios-production-build/

3. **本番ビルドの作成**：
   https://docs.expo.dev/deploy/build-project/

4. **内部配信（Internal Distribution）**：
   https://docs.expo.dev/build/internal-distribution/

## 重要なポイントの説明

### プロファイルの使い分け

公式ドキュメントによると、「Production builds are submitted to app stores for release to the general public or as part of a store-facilitated testing process such as TestFlight」とあります。つまり：

- **development**: 開発ツールを含み、App Storeには提出されない
- **preview**: 内部テスト用（Ad Hoc配信）
- **production**: App Store/TestFlight用

### なぜproductionが必要か

内部配信（Internal Distribution）では「distribution": "internal"」を設定し、「iOS: Builds using this profile will use either ad hoc or enterprise provisioning」となります。これはTestFlightとは異なる配信方法です。

TestFlightは「A production iOS build is optimized for Apple's App Store Connect, which allows distributing builds to testers with TestFlight」とあるように、App Store Connectを通じた配信システムなので、productionビルドが必要です。

### 外部記事

Atlas Softwareの記事では「Expo also has the ability to automatically release builds of your app to App Store Connect and Google Play Console, where they can be distributed to internal testers via TestFlight」と説明されており、TestFlightはApp Store Connect経由の配信であることが確認できます。

## まとめ

TestFlightは開発・テスト用のツールですが、**Appleの配信インフラ（App Store Connect）**を使用するため、技術的にはApp Storeと同じ署名・配信プロセスが必要です。そのため、Expoでは`production`プロファイルを使用する必要があります。