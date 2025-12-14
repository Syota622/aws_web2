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
    AS formatted_event_timestamp,  -- event_timestampを年月日時分秒形式に変換 (デフォルトはUTC)
  FORMAT_TIMESTAMP(
    '%Y-%m-%d %H:%M:%S', TIMESTAMP_MICROS(t1.event_timestamp), 'Asia/Tokyo')
    AS jtc,  -- event_timestampをJST (日本標準時) の年月日時分秒形式に変換
  FORMAT_TIMESTAMP('%Y-%m-%d %H:%M:%S', CURRENT_TIMESTAMP())
    AS current_system_timestamp,  -- 現在時刻を年月日時分秒形式で追加 (デフォルトはUTC)
  t2.value.string_value AS performance_id
FROM
  `counterapp-1bb9e`.`analytics_515965369`.`events_intraday_20251211` AS t1,
  UNNEST(t1.event_params) AS t2
WHERE t1.event_name = 'button_press_test' AND t2.key = 'performance_id'
ORDER BY t1.event_timestamp DESC;
```

## 公演ごとの出現回数
```sql
SELECT
  t1.event_name, t1.event_timestamp, t2.value.string_value AS performance_id
FROM
  `counterapp-1bb9e`.`analytics_515965369`.`events_intraday_20251211` AS t1,
  UNNEST(t1.event_params) AS t2
WHERE t1.event_name = 'button_press_test' AND t2.key = 'performance_id'
ORDER BY t1.event_timestamp DESC;
```

## 特定のキーを取得
```sql
SELECT
  t.event_name,
  MAX(CASE WHEN param.key = 'performance_id' THEN param.value.string_value END)
    AS performance_id,
  MAX(
    CASE WHEN param.key = 'performance_name' THEN param.value.string_value END)
    AS performance_name
FROM
  `counterapp-1bb9e`.`analytics_515965369`.`events_intraday_20251211` AS t,
  UNNEST(t.event_params) AS param
WHERE t.event_name LIKE '%button_press%'
GROUP BY
  t.event_name,
  t.event_timestamp  -- Include event_timestamp in GROUP BY to ensure distinct rows for each original event
ORDER BY t.event_timestamp DESC
LIMIT 30;
```

## 公演名と公演IDを取得
```sql
SELECT
  t1.event_name,
  FORMAT_TIMESTAMP('%Y-%m-%d %H:%M:%S', TIMESTAMP_MICROS(t1.event_timestamp))
    AS formatted_event_timestamp,  -- event_timestampを年月日時分秒形式に変換 (デフォルトはUTC)
  t2.value.string_value AS performance_name,
  t2.value.string_value AS performance_id
FROM
  `counterapp-1bb9e`.`analytics_515965369`.`events_intraday_*` AS t1,
  UNNEST(t1.event_params) AS t2
WHERE 
  (t.event_name LIKE '%performance%')
    OR
  _TABLE_SUFFIX BETWEEN '20251211' AND '20251214'
ORDER BY t1.event_timestamp DESC;
```

# key value取得
```sql
SELECT 
  event_date,
  event_name,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'performance_id') AS performance_id,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'performance_name') AS performance_name
FROM 
  `counterapp-1bb9e.analytics_515965369.events_intraday_*` AS t1
WHERE 
  (_TABLE_SUFFIX BETWEEN '20251211' AND '20251214')
  AND t1.event_name LIKE '%performance%'
LIMIT 3
```

```sql
SELECT 
  event_date,
  event_name,
  MAX(IF(ep.key = 'performance_id', ep.value.string_value, NULL)) AS performance_id,
  MAX(IF(ep.key = 'performance_name', ep.value.string_value, NULL)) AS performance_name
FROM 
  `counterapp-1bb9e.analytics_515965369.events_intraday_*` AS t1,
  UNNEST(event_params) AS ep
WHERE 
  (_TABLE_SUFFIX BETWEEN '20251211' AND '20251214')
  AND t1.event_name LIKE '%performance%'
GROUP BY 
  event_date, event_name, event_timestamp
LIMIT 3
```