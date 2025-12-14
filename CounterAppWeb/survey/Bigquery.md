# Google Analyticsテーブル
- 各テーブルはevents_YYYYMMDDテーブルに作成される
https://support.google.com/analytics/answer/7029846?hl=ja&utm_source=chatgpt.com
- _TABLE_SUFFIX はテーブル名の末尾に追加される
```sql
SELECT
  event_date,
  event_name,
  COUNT(*) AS event_count
FROM
  `your_project.analytics_123456.events_*`
WHERE
  _TABLE_SUFFIX BETWEEN '20250101' AND '20250107'
GROUP BY
  event_date, event_name
```