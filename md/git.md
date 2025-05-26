<<<<<<< HEAD
=======
# git check-pick

```log
# qaブランチに移動
git checkout qa

# 最新状態に更新
git pull origin qa

# 新しいブランチを作成（ブランチ名は適宜変更してください）
git checkout -b feature/selected-commits-to-qa

# 指定した2つのコミットをチェリーピック
git cherry-pick bcd91bd
git cherry-pick 9be268b

# 新しいブランチをリモートにプッシュ
git push origin feature/selected-commits-to-qa

GitHubでプルリクエストを作成

GitHubのリポジトリページにアクセス
「Compare & pull request」ボタンをクリック
以下のように設定：

Base: qa ← Compare: feature/selected-commits-to-qa


プルリクエストのタイトル例：
特定のコミットをqaブランチに反映

プルリクエストの説明例：
## 対象コミット
- bcd91bd: first commit
- 9be268b: update expo

developブランチから上記2つのコミットのみをqaブランチに反映します。

「Create pull request」をクリック

# 確認方法
マージ後にqaブランチで確認：
git checkout qa
git pull origin qa
git log --oneline -5
```
>>>>>>> f3dac79 (Merge pull request #11 from Syota622/feature/test)
