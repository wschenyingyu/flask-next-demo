# 部署指南

本项目采用前后端分离部署：
- **前端** → Vercel（Next.js 官方平台，免费）
- **后端** → Render（支持 Flask，免费 tier）

---

## 一、部署后端到 Render

### 1.1 准备工作

1. 确保代码已推送到 GitHub 公开仓库
2. 注册 [Render](https://render.com) 账号（可用 GitHub 登录）

### 1.2 创建后端服务

1. 登录 Render 控制台 → 点击 **New +** → 选择 **Web Service**
2. 连接你的 GitHub 仓库
3. 填写配置：

| 配置项 | 值 |
|--------|-----|
| Name | `community-goods-api` |
| Region | Singapore（或离你最近的） |
| Branch | `main` |
| Root Directory | `backend` |
| Runtime | Python 3 |
| Build Command | `pip install -r requirements.txt` |
| Start Command | `gunicorn wsgi:app --bind 0.0.0.0:$PORT` |
| Instance Type | Free |

4. 添加环境变量（在 Advanced 设置中）：

| Key | Value |
|-----|-------|
| DB_FILE | `/tmp/goods.db` |

5. 点击 **Create Web Service**

### 1.3 验证后端

部署完成后（约2-3分钟），Render 会分配一个地址，例如：
```
https://community-goods-api.onrender.com
```

在浏览器中测试：
- 访问 `https://你的地址/api/index` → 应返回欢迎语 JSON
- 访问 `https://你的地址/api/goods` → 应返回物品列表 JSON

**记下这个后端地址，前端部署时需要用到。**

> ⚠️ Render 免费 tier 会在 15 分钟无请求后休眠，首次访问可能需要等待 30-60 秒唤醒。

---

## 二、部署前端到 Vercel

### 2.1 准备工作

1. 注册 [Vercel](https://vercel.com) 账号（可用 GitHub 登录）
2. 确保 `frontend/` 目录已推送到 GitHub

### 2.2 创建前端项目

1. 登录 Vercel → 点击 **Add New** → **Project**
2. 导入你的 GitHub 仓库
3. 填写配置：

| 配置项 | 值 |
|--------|-----|
| Framework Preset | Next.js |
| Root Directory | `frontend` |
| Build Command | `npm run build`（默认即可） |
| Output Directory | `.next`（默认即可） |

4. **关键步骤** - 添加环境变量：

在 Environment Variables 中添加：

| Key | Value |
|-----|-------|
| NEXT_PUBLIC_API_BASE_URL | `https://你的Render后端地址` |

例如：
```
NEXT_PUBLIC_API_BASE_URL=https://community-goods-api.onrender.com
```

5. 点击 **Deploy**

### 2.3 验证前端

部署完成后（约1-2分钟），Vercel 会分配地址，例如：
```
https://your-project.vercel.app
```

打开后应能看到首页欢迎语（从后端获取），点击进入物品列表页和费用计算器页面测试功能。

---

## 三、本地开发

### 3.1 启动后端

```bash
cd backend
pip install -r requirements.txt
python app.py
```
后端运行在 `http://127.0.0.1:5000`

### 3.2 启动前端

```bash
cd frontend
npm install
npm run dev
```
前端运行在 `http://localhost:3000`

本地开发时无需设置环境变量，默认连接 `http://127.0.0.1:5000`。

如需指定后端地址，创建 `frontend/.env.local` 文件：
```bash
cp frontend/.env.local.example frontend/.env.local
# 编辑 .env.local 修改 NEXT_PUBLIC_API_BASE_URL
```

---

## 四、部署架构图

```
用户浏览器
    │
    ▼
Vercel (前端 Next.js)
    │  fetch API
    ▼
Render (后端 Flask + Gunicorn)
    │
    ▼
SQLite (/tmp/goods.db)
```

---

## 五、注意事项

1. **Render 免费版休眠**：15分钟无请求会自动休眠，唤醒需等待约30秒。考核演示前建议先访问一次唤醒。
2. **数据持久性**：Render 免费版文件系统是临时的，重新部署后 SQLite 数据会重置为初始数据。对于实训项目足够使用。
3. **CORS 跨域**：后端已配置 `flask-cors` 允许所有跨域请求，无需额外处理。
4. **HTTPS**：Vercel 和 Render 默认提供 HTTPS，前端访问后端不会有混合内容问题。
