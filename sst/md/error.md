- とりあえず、pnpm installする
```log
osaka-provider pulumi:providers:aws
failed to load plugin /Users/shota/Library/Application Support/sst/plugins/resource-aws-v6.66.2/pulumi-resource-aws: plugin not found
```

- sstやpulumiのバージョン、また公式ドキュメントをしっかりと読む
```
✕  Failed    

Error: Missing required property 'rules'
    at new Plan (/Users/shota/Desktop/HC/aws_web2/sst/.sst/platform/node_modules/@pulumi/backup/plan.ts:128:23)
    at infra/backup/backup-dynamodb.ts (file:///Users/shota/Desktop/HC/aws_web2/sst/infra/backup/backup-dynamodb.ts:32:20)
    at __init (file:///Users/shota/Desktop/HC/aws_web2/sst/.sst/platform/sst.config.1747013216647.mjs:11:56)
    at file:///Users/shota/Desktop/HC/aws_web2/sst/sst.config.ts:47:11
    at run (file:///Users/shota/Desktop/HC/aws_web2/sst/sst.config.ts:47:5)
    at run (file:///Users/shota/Desktop/HC/aws_web2/sst/.sst/platform/src/auto/run.ts:19:20)
    at file:///Users/shota/Desktop/HC/aws_web2/sst/eval.ts:4:22
```

- remix系のエラーが出た場合、とりあえず、rm -rf ./node_modules & pnpm installする
