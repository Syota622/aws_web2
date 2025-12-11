# Bigquery

## イベントログの情報を新規に取得
```sql
SELECT event_name, event_params
FROM `counterapp-1bb9e`.`analytics_515965369`.`events_intraday_20251211`
WHERE event_name LIKE '%button_press%'
ORDER BY event_timestamp DESC
LIMIT 30;
```

## 公演id出現回数
```sql
SELECT
  t2.value.string_value AS performance_id,
  COUNT(t2.value.string_value) AS count_of_performance_id
FROM
  `counterapp-1bb9e`.`analytics_515965369`.`events_intraday_20251211` AS t1,
  UNNEST(t1.event_params) AS t2
WHERE t1.event_name = 'button_press_test' AND t2.key = 'performance_id'
GROUP BY performance_id
ORDER BY count_of_performance_id DESC;
```
## 公演id取得
```sql
SELECT
  t1.event_name, t1.event_timestamp, t2.value.string_value AS performance_id
FROM
  `counterapp-1bb9e`.`analytics_515965369`.`events_intraday_20251211` AS t1,
  UNNEST(t1.event_params) AS t2
WHERE t1.event_name = 'button_press_test' AND t2.key = 'performance_id'
ORDER BY t1.event_timestamp DESC;
```
## timestamp 変換
```sql
SELECT
  t1.event_name,
  FORMAT_TIMESTAMP('%Y-%m-%d %H:%M:%S', TIMESTAMP_MICROS(t1.event_timestamp))
    AS formatted_event_timestamp,  -- event_timestampを年月日時分秒形式に変換
  FORMAT_TIMESTAMP('%Y-%m-%d %H:%M:%S', CURRENT_TIMESTAMP())
    AS current_system_timestamp,  -- 現在時刻を年月日時分秒形式で追加
  t2.value.string_value AS performance_id
FROM
  `counterapp-1bb9e`.`analytics_515965369`.`events_intraday_20251211` AS t1,
  UNNEST(t1.event_params) AS t2
WHERE t1.event_name = 'button_press_test' AND t2.key = 'performance_id'
ORDER BY t1.event_timestamp DESC;
```