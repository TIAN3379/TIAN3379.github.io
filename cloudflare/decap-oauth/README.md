# Decap CMS Cloudflare Worker

这个目录是当前博客 `/admin/` 后台使用的 GitHub OAuth 代理。

当前 CMS 配置已经指向：

- `https://tian3379-decap-oauth.337953811.workers.dev`

我已经确认这个 Worker 地址目前可用，所以后台登录会优先直接复用它。

## 什么时候需要重新部署

只有在下面几种情况下，才需要重新部署 Worker：

- 这个 `workers.dev` 地址失效
- 你想更换 Cloudflare 账号
- 你要更换 GitHub OAuth App
- 你的仓库改成私有，需要扩大 OAuth scope

## 重新部署步骤

1. 在 GitHub 创建 OAuth App

- `Application name`: `tian3379-decap-cms`
- `Homepage URL`: 你的 Worker 地址
- `Authorization callback URL`: `你的 Worker 地址/callback`

2. 在这个目录执行

```powershell
cd D:\blog_sample\reimu-template\cloudflare\decap-oauth
npm install
npx wrangler login
npx wrangler secret put GITHUB_OAUTH_ID
npx wrangler secret put GITHUB_OAUTH_SECRET
npx wrangler deploy
```

3. 如果 Worker 地址变了，回填 [config.yml](/D:/blog_sample/reimu-template/source/admin/config.yml)

- `base_url`
- `api_root`

然后重新推送博客仓库。

## 私有仓库说明

如果未来博客仓库改成私有，把 [wrangler.toml](/D:/blog_sample/reimu-template/cloudflare/decap-oauth/wrangler.toml) 里的：

```toml
GITHUB_SCOPE = "public_repo,user"
```

改成：

```toml
GITHUB_SCOPE = "repo,user"
```
