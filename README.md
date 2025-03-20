# aws_web2

# SST
- git clone https://github.com/sst-example/sst-example.git
  - https://sst.dev/docs/set-up-a-monorepo/
- npx replace-in-file '/monorepo-template/g' 'sst' '**/*.*' --verbose

```sh
% npx replace-in-file '/monorepo-template/g' 'sst' '**/*.*' --verbose
Need to install the following packages:
replace-in-file@8.3.0
Ok to proceed? (y) y

Replacing '/monorepo-template/g' with 'sst'
8 file(s) were changed
- sst.config.ts
- package.json
- README.md
- packages/scripts/package.json
- packages/scripts/src/example.ts
- packages/functions/package.json
- packages/functions/src/api.ts
- packages/core/package.json
```

- cd sst-example
- npm install
- npx sst deploy --stage dev
- npx sst diff --stage dev
- npx sst remove --stage dev
- npx sst runlock
