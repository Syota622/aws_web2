以下は GA4 の Data API / Realtime API を実際に動かすための手順（実行方法） を、公式情報・一般的な実装パターンを元に整理したものです。
※ サンプルコードは公式 Quickstart や一般的な実装例から引用した形で示します。citeturn0search14‡

⸻

📌 GA4 API 実行の準備（共通）

1) Google Cloud プロジェクトを作成
	•	Google Cloud Console で新しい GCP プロジェクトを作成します。して 有効にする。に使います。*与します。1beta/properties/{propertyId}:runReport

)
response = client.run_report(request=request)
for row in response.rows:
    print(row)

（このサンプルは公式 Quickstart で紹介されています） https://analyticsdata.googleapis.com/v1beta/properties/{propertyId}:runRealtimeReport

### 📋 JSON リクエスト例
```json
POST https://analyticsdata.googleapis.com/v1beta/properties/PROPERTY_ID:runRealtimeReport
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "dimensions": [{"name": "eventName"}],
  "metrics": [{"name": "eventCount"}]
}

※ リアルタイム API では通常のレポートより対応ディメンション／メトリクスが限定されます（UI の Realtime レポートと同様の仕様）。citeturn0search1‡

⸻

🧠 実行までの流れ（まとめ）
	1.	GCP で API を有効化
→ Analytics Data API を有効にする。証情報の準備**
→ サービスアカウントの JSON キーを取得。citeturn0search3‡
	2.	GA4 プロパティにアクセス権を付与
→ GA4 でサービスアカウントを Viewer/Analyst 以上に設定。 を使いアクセストークンを生成（各言語 SDK などで自動）。citeturn0search2‡
	3.	API 呼び出し
→ runReport / runRealtimeReport 等のエンドポイントにリクエスト。citeturn0search13‡

⸻

📌 Tips（実行時の注意）

✔ 認証トークン（Bearer） を付けて呼ぶことが必須（OAuth / サービスアカウント）。citeturn0search3‡
✔ リアルタイム API は期間指定不要で現在〜過去 30 分（360 は最大 60 分）のデータ取得が可能です。返り、プログラム内でパースして利用します。スタート（日本語）**
https://developers.google.com/analytics/devguides/reporting/data/v1/quickstart?hl=ja citeturn0search14‡
	•	Data API v1 REST リファレンス
https://developers.google.com/analytics/devguides/reporting/data/v1/rest ics
```

# Curl
はい、curl でも GA4 の Data API / Realtime API を実行できます（REST API なので HTTP POST を送れば動きます）。
以下に curl で実行する方法（共通手順・例） をまとめます。

⸻

🔑 前提：認証が必要

GA4 API を使うには OAuth2 のアクセストークン（Bearer Token） を付けた HTTP リクエストが必須です。
これは サービスアカウント 等で取得しておきます。

Authorization: Bearer YOUR_ACCESS_TOKEN

トークンの取得方法例（gcloud で）：

gcloud auth application-default print-access-token

※ これで得られるトークンを YOUR_ACCESS_TOKEN に入れてください。 citeturn0search28‡

⸻

📌 1) Data API（runReport）の curl 実行例

✔ エンドポイント（公式）

POST https://analyticsdata.googleapis.com/v1beta/{property=properties/*}:runReport 軸・指標

📌 返却は JSON 形式で列データが返ってきます。.com/v1beta/{property=properties/*}:runRealtimeReport`  分以内のイベントを対象**として返します。 期間指定は不要（自動的に直近 30 分分を対象） guides/reporting/data/v1/rest/v1beta/properties/runReport   https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/properties/runRealtimeReport  Realtime API 仕様（公式説明）
https://developers.google.com/analytics/devguides/reporting/data/v1/realtime-basics  の形で使います。 citeturn0search15‡
	•	返却される JSON は dimensions / metrics の指定内容に応じてカラム構造が変わります。
	•	現状は v1beta 版 API のため、将来的に仕様変更の可能性があります。