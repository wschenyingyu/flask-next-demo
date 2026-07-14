# 部署指南

本项目是纯 Next.js 项目，所有 API 通过 Next.js API Routes 实现，无需单独部署后端。

---

## 方案一：Vercel 部署（推荐）

### 配置信息

| 配置项 | 值 |
|--------|-----|
| Name | `community-goods-platform` |
| Branch | `main` |
| Root Directory | 留空（代码在根目录） |
| Framework Preset | Next.js（自动检测） |
| Build Command | `npm run build` |
| Output Directory | `.next` |
| Instance Type | Hobby（免费） |

### 环境变量（可选）

| Key | Value |
|-----|-------|
| NEXT_PUBLIC_API_BASE_URL | `https://你的域名/api` |

### 部署步骤

1. 登录 [Vercel](https://vercel.com/)
2. Add New → Project
3. 导入 GitHub 仓库 `flask-next-demo`
4. 点击 Deploy
5. 等待部署完成，获取 URL

### 验证

访问部署地址，测试：
- `https://你的域名/api/index` → 返回欢迎语 JSON
- `https://你的域名/api/goods` → 返回物品列表 JSON

---

## 方案二：Cloudflare Pages 部署

### 配置信息

| 配置项 | 值 |
|--------|-----|
| Project name | `community-goods-platform` |
| Build command | `npm run build` |
| Build output directory | `.next` |

### 部署步骤

1. 登录 [Cloudflare Pages](https://pages.cloudflare.com/)
2. Create a project
3. 连接 GitHub 仓库
4. 配置构建参数
5. Save and Deploy

---

## 方案三：Netlify 部署

### 配置信息

| 配置项 | 值 |
|--------|-----|
| Build command | `npm run build` |
| Publish directory | `.next` |

### 部署步骤

1. 登录 [Netlify](https://www.netlify.com/)
2. Add new site → Import an existing project
3. 选择 GitHub 仓库
4. 配置构建参数
5. Deploy site

---

## 本地开发

```bash
npm install
npm run dev
```

访问 http://localhost:3000

---

## 注意事项

1. **数据持久化**: 部署到 Vercel/Cloudflare Pages 时，文件系统是只读的，POST 请求可能失败
2. **自动部署**: 推送代码到 GitHub 会自动触发重新部署
3. **国内访问**: Cloudflare Pages 在国内访问更稳定