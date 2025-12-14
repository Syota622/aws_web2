# Bigquery

## イベントログの情報を新規に取得
```sql
SELECT event_name, event_params
FROM `counterapp-1bb9e`.`analytics_515965369`.`events_intraday_20251211`
WHERE event_name LIKE '%button_press%'
ORDER BY event_timestamp DESC
LIMIT 30;
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

# key value取得
```sql
SELECT 
  event_date,
  event_name,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'performance_id') AS performance_id,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'performance_name') AS performance_name,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'timestamp') AS timestamp
FROM 
  `counterapp-1bb9e.analytics_515965369.events_intraday_*` AS t1
WHERE 
  (_TABLE_SUFFIX BETWEEN '20251211' AND '20251214')
  AND t1.event_name LIKE '%performance%'
```


# eventごとのカウント数
```sql
SELECT 
  event_name,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'performance_id') AS performance_id,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'performance_name') AS performance_name,
  COUNT(*) AS event_count
FROM 
  `counterapp-1bb9e.analytics_515965369.events_intraday_*` AS t1
WHERE 
  (_TABLE_SUFFIX BETWEEN '20251211' AND '20251214')
  AND t1.event_name LIKE '%performance%'
GROUP BY 
  event_name,
  performance_id,
  performance_name
ORDER BY 
  event_count DESC
```

# 公演ごとのカウント数
## 1時間ごと
```sql
SELECT 
  TIMESTAMP_TRUNC(
    PARSE_TIMESTAMP('%Y-%m-%dT%H:%M:%E*SZ', (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'timestamp')),
    HOUR
  ) AS hour,
  event_name,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'performance_id') AS performance_id,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'performance_name') AS performance_name,
  COUNT(*) AS event_count
FROM 
  `counterapp-1bb9e.analytics_515965369.events_intraday_*` AS t1
WHERE 
  (_TABLE_SUFFIX BETWEEN '20251211' AND '20251214')
  AND t1.event_name LIKE '%performance%'
GROUP BY 
  hour,
  event_name,
  performance_id,
  performance_name
ORDER BY 
  hour,
  event_name
```

## 10分ごと
```sql
SELECT 
  TIMESTAMP_SECONDS(
    DIV(
      UNIX_SECONDS(PARSE_TIMESTAMP('%Y-%m-%dT%H:%M:%E*SZ', (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'timestamp'))),
      600
    ) * 600
  ) AS timestamp_10min_utc,
  FORMAT_TIMESTAMP(
    '%Y-%m-%d %H:%M',
    TIMESTAMP_SECONDS(
      DIV(
        UNIX_SECONDS(PARSE_TIMESTAMP('%Y-%m-%dT%H:%M:%E*SZ', (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'timestamp'))),
        600
      ) * 600
    ),
    'Asia/Tokyo'
  ) AS time_10min_jst,
  event_name,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'performance_id') AS performance_id,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'performance_name') AS performance_name,
  COUNT(*) AS event_count
FROM 
  `counterapp-1bb9e.analytics_515965369.events_intraday_*` AS t1
WHERE 
  (_TABLE_SUFFIX BETWEEN '20251211' AND '20251214')
  AND t1.event_name LIKE '%performance%'
GROUP BY 
  timestamp_10min_utc,
  time_10min_jst,
  event_name,
  performance_id,
  performance_name
ORDER BY 
  timestamp_10min_utc,
  event_name
```

# ダッシュボード化時のクエリ
```sql
SELECT 
  timestamp_10min,
  time_label_jst,
  event_name,
  performance_id,
  performance_name,
  event_count
FROM (
  SELECT 
    TIMESTAMP_SECONDS(
      DIV(
        UNIX_SECONDS(PARSE_TIMESTAMP('%Y-%m-%dT%H:%M:%E*SZ', (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'timestamp'))),
        600
      ) * 600
    ) AS timestamp_10min,
    FORMAT_TIMESTAMP(
      '%Y-%m-%d %H:%M',
      TIMESTAMP_SECONDS(
        DIV(
          UNIX_SECONDS(PARSE_TIMESTAMP('%Y-%m-%dT%H:%M:%E*SZ', (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'timestamp'))),
          600
        ) * 600
      ),
      'Asia/Tokyo'
    ) AS time_label_jst,
    event_name,
    (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'performance_id') AS performance_id,
    (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'performance_name') AS performance_name,
    COUNT(*) AS event_count
  FROM 
    `counterapp-1bb9e.analytics_515965369.events_intraday_*`
  WHERE 
    event_name LIKE '%performance%'
    AND (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'timestamp') IS NOT NULL
  GROUP BY 
    timestamp_10min,
    time_label_jst,
    event_name,
    performance_id,
    performance_name
)
ORDER BY
  timestamp_10min
```

# 1秒、1分、10分
```sql
SELECT 
  timestamp_1sec,
  time_label_1sec_jst,
  timestamp_1min,
  time_label_1min_jst,
  timestamp_10min,
  time_label_10min_jst,
  event_name,
  performance_id,
  performance_name,
  event_count
FROM (
  SELECT 
    -- 1秒
    TIMESTAMP_SECONDS(
      UNIX_SECONDS(PARSE_TIMESTAMP('%Y-%m-%dT%H:%M:%E*SZ', (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'timestamp')))
    ) AS timestamp_1sec,
    FORMAT_TIMESTAMP(
      '%Y-%m-%d %H:%M:%S',
      PARSE_TIMESTAMP('%Y-%m-%dT%H:%M:%E*SZ', (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'timestamp')),
      'Asia/Tokyo'
    ) AS time_label_1sec_jst,
    
    -- 1分
    TIMESTAMP_SECONDS(
      DIV(
        UNIX_SECONDS(PARSE_TIMESTAMP('%Y-%m-%dT%H:%M:%E*SZ', (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'timestamp'))),
        60
      ) * 60
    ) AS timestamp_1min,
    FORMAT_TIMESTAMP(
      '%Y-%m-%d %H:%M',
      TIMESTAMP_SECONDS(
        DIV(
          UNIX_SECONDS(PARSE_TIMESTAMP('%Y-%m-%dT%H:%M:%E*SZ', (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'timestamp'))),
          60
        ) * 60
      ),
      'Asia/Tokyo'
    ) AS time_label_1min_jst,
    
    -- 10分
    TIMESTAMP_SECONDS(
      DIV(
        UNIX_SECONDS(PARSE_TIMESTAMP('%Y-%m-%dT%H:%M:%E*SZ', (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'timestamp'))),
        600
      ) * 600
    ) AS timestamp_10min,
    FORMAT_TIMESTAMP(
      '%Y-%m-%d %H:%M',
      TIMESTAMP_SECONDS(
        DIV(
          UNIX_SECONDS(PARSE_TIMESTAMP('%Y-%m-%dT%H:%M:%E*SZ', (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'timestamp'))),
          600
      ) * 600
      ),
      'Asia/Tokyo'
    ) AS time_label_10min_jst,
    
    event_name,
    (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'performance_id') AS performance_id,
    (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'performance_name') AS performance_name,
    COUNT(*) AS event_count
  FROM 
    `counterapp-1bb9e.analytics_515965369.events_intraday_*`
  WHERE 
    event_name LIKE '%performance%'
    AND (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'timestamp') IS NOT NULL
  GROUP BY 
    timestamp_1sec,
    time_label_1sec_jst,
    timestamp_1min,
    time_label_1min_jst,
    timestamp_10min,
    time_label_10min_jst,
    event_name,
    performance_id,
    performance_name
)
ORDER BY
  timestamp_1sec
```