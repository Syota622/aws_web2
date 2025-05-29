- eas build --platform android --profile production --local --non-interactive
Expoへのビルドを行う。--localをつけるとローカルでビルドを行う。--non-interactiveをつけるとビルド中にユーザーの入力を待たない。

- eas build --platform all --profile production --non-interactive --no-wait
Expoへのビルドを行う。--no-waitをつけるとビルドが完了するまで待たない。

- eas build --platform ios --profile development --local --non-interactive
上記同様

- eas build --platform ios --profile production --non-interactive --auto-submit
非対話的にビルドを行った後に、TestFlightにビルドを送信する。
