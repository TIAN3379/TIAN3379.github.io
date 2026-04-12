# Decap CMS Cloudflare Worker

这个目录是给 `https://tian3379.github.io/admin/` 用的 GitHub OAuth 代理。

你不需要购买域名，可以直接使用 Cloudflare 免费分配的 `*.workers.dev` 域名。

## 1. 创建 GitHub OAuth App

在 GitHub 打开：

- `Settings -> Developer settings -> OAuth Apps -> New OAuth App`

填写：

- `Application name`: `tian3379-decap-cms`
- `Homepage URL`: 先填你将来 Worker 的地址，例如 `https://tian3379-decap-oauth.<你的 workers 子域>.workers.dev`
- `Authorization callback URL`: `https://tian3379-decap-oauth.<你的 workers 子域>.workers.dev/callback`

保存后拿到：

- `Client ID`
- `Client Secret`

## 2. 登录并部署 Cloudflare Worker

在这个目录执行：

```powershell
cd D:\BLOG\cloudflare\decap-oauth
npm install
npx wrangler login
npx wrangler secret put GITHUB_OAUTH_ID
npx wrangler secret put GITHUB_OAUTH_SECRET
npx wrangler deploy
```

部署完成后，Cloudflare 会返回一个地址，形如：

```text
https://tian3379-decap-oauth.<你的 workers 子域>.workers.dev
```

## 3. 回填 CMS 配置

把 [D:\BLOG\source\admin\config.yml](/D:/BLOG/source/admin/config.yml) 里的这两行取消注释并改成你的 Worker 地址：

```yml
base_url: https://tian3379-decap-oauth.<你的 workers 子域>.workers.dev
auth_endpoint: /auth
```

然后执行：

```powershell
cd D:\BLOG
git add source/admin/config.yml
git commit -m "chore: enable decap oauth worker"
git push origin main
```

## 4. 验证

部署完成后检查：

- Worker 健康检查：`https://你的-worker.workers.dev/health`
- CMS 后台：`https://tian3379.github.io/admin/`

如果 GitHub 仓库将来改成私有仓库，把 [D:\BLOG\cloudflare\decap-oauth\wrangler.toml](/D:/BLOG/cloudflare/decap-oauth/wrangler.toml) 的：

```toml
GITHUB_SCOPE = "public_repo,user"
```

改成：

```toml
GITHUB_SCOPE = "repo,user"
```
