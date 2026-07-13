# 项目部署详细指南

## 目录

- [方案一：Render 全栈部署（推荐）](#方案一render-全栈部署推荐)
  - [1. 准备工作](#1-准备工作)
  - [2. 后端部署](#2-后端部署)
  - [3. 前端部署](#3-前端部署)
  - [4. 配置前后端联通](#4-配置前后端联通)
  - [5. 验证部署](#5-验证部署)
- [方案二：Vercel 前端 + Render 后端](#方案二vercel-前端--render-后端)
- [方案三：ngrok 内网穿透（本地演示用）](#方案三ngrok-内网穿透本地演示用)
- [常见问题排查](#常见问题排查)

---

## 方案一：Render 全栈部署（推荐）

Render 是一个支持 Python 和静态网站部署的云平台，提供免费额度，适合学生项目使用。

### 1. 准备工作

#### 1.1 注册 Render 账号

1. 打开浏览器，访问 [https://render.com/](https://render.com/)
2. 点击右上角的 "Get Started" 或 "Sign Up"
3. 选择用 GitHub 账号登录（推荐，方便后续连接仓库）
4. 按照提示完成注册流程

#### 1.2 确保代码已推送到 GitHub

你的代码应该已经在 GitHub 仓库中。如果还没有，请先推送到 GitHub：

```bash
# 检查当前分支
git branch

# 确保在主分支
git checkout main

# 推送代码
git push origin main
```

---

### 2. 后端部署

#### 步骤 1：进入 Render 控制台

1. 登录 Render 后，进入 Dashboard
2. 点击右上角的 "New +" 按钮
3. 选择 "Web Service"

#### 步骤 2：连接 GitHub 仓库

1. 在 "Connect a repository" 页面，找到你的项目仓库
2. 如果找不到，点击 "Configure account" 授权 Render 访问你的仓库
3. 找到 `flask-next-demo` 仓库，点击 "Connect"

#### 步骤 3：配置后端服务

填写以下配置信息：

| 配置项 | 值 | 说明 |
|--------|-----|------|
| **Name** | `community-goods-api` | 服务名称，会成为URL的一部分 |
| **Region** | `Oregon (US West)` 或就近选择 | 服务器所在区域 |
| **Branch** | `main` | 部署的分支 |
| **Root Directory** | `backend` | 后端代码所在目录 |
| **Runtime** | `Python 3` | 运行环境 |
| **Build Command** | `pip install -r requirements.txt` | 构建命令 |
| **Start Command** | `gunicorn app:app` | 启动命令 |

**注意**：Start Command 使用 `gunicorn` 而不是 `python app.py`，因为 gunicorn 是生产级 WSGI 服务器，更稳定。

#### 步骤 4：选择套餐

1. 向下滚动到 "Instance Type" 部分
2. 选择 **Free** 套餐（免费额度足够学生项目使用）
3. 免费套餐注意事项：
   - 服务会在闲置15分钟后休眠
   - 首次访问需要等待约30秒启动
   - 每月有使用时长限制，但学生项目足够用

#### 步骤 5：添加环境变量

1. 点击 "Advanced" 展开高级选项
2. 点击 "Add Environment Variable"
3. 添加以下环境变量：

| Key | Value | 说明 |
|-----|-------|------|
| `DB_FILE` | `goods.db` | 数据库文件名 |

4. 可以后续再添加更多环境变量

#### 步骤 6：创建服务

1. 确认所有配置正确
2. 点击页面底部的 "Create Web Service" 按钮
3. Render 会开始构建和部署你的后端服务
4. 部署过程大约需要 2-5 分钟

#### 步骤 7：等待部署完成

1. 你会看到部署日志实时输出
2. 等待日志中出现 "Your service is live 🎉" 字样
3. 部署成功后，页面顶部会显示服务的 URL
4. **记录下这个 URL**，类似：`https://community-goods-api.onrender.com`

#### 步骤 8：验证后端部署

在浏览器中访问后端 API 测试：

```
https://你的后端URL/api/index
```

应该返回：
```json
{"msg":"欢迎使用社区便民物品借用管理平台"}
```

再测试物品列表接口：
```
https://你的后端URL/api/goods
```

应该返回物品列表的 JSON 数据。

---

### 3. 前端部署

#### 步骤 1：回到 Render 控制台

1. 点击左上角的 Render logo 回到 Dashboard
2. 点击右上角的 "New +" 按钮
3. 选择 "Static Site"

#### 步骤 2：连接同一个仓库

1. 再次选择你的 `flask-next-demo` 仓库
2. 点击 "Connect"

#### 步骤 3：配置前端静态站点

填写以下配置信息：

| 配置项 | 值 | 说明 |
|--------|-----|------|
| **Name** | `community-goods-frontend` | 站点名称 |
| **Branch** | `main` | 部署的分支 |
| **Root Directory** | `frontend` | 前端代码所在目录 |
| **Build Command** | `npm run build` | 构建命令 |
| **Publish Directory** | `.next` | 构建输出目录 |

**注意**：Next.js 的静态站点部署有特殊要求。如果 `.next` 目录不行，可能需要使用 `out` 目录并配置静态导出。

#### 步骤 4：添加环境变量

**非常重要**：前端需要知道后端 API 的地址。

1. 点击 "Advanced" 展开高级选项
2. 点击 "Add Environment Variable"
3. 添加环境变量：

| Key | Value | 说明 |
|-----|-------|------|
| `NEXT_PUBLIC_API_URL` | `https://你的后端URL` | 后端API地址，注意不要加末尾的 `/` |

**示例**：
```
NEXT_PUBLIC_API_URL = https://community-goods-api.onrender.com
```

#### 步骤 5：选择套餐

1. 向下滚动到 "Instance Type" 部分
2. 静态站点是免费的，直接继续

#### 步骤 6：创建静态站点

1. 确认所有配置正确
2. 点击 "Create Static Site" 按钮
3. Render 会开始构建前端
4. 构建过程大约需要 3-8 分钟

#### 步骤 7：等待部署完成

1. 查看构建日志
2. 等待出现 "Your site is live 🎉" 字样
3. 记录下前端的 URL，类似：`https://community-goods-frontend.onrender.com`

---

### 4. 配置前后端联通

#### 步骤 1：更新后端 CORS 配置（可选）

如果前端访问后端出现跨域问题，需要在后端添加 CORS 配置。

当前代码中 `CORS(app)` 已经允许所有来源访问，所以通常不需要额外配置。

如果想要更安全，可以在 Render 后端的环境变量中添加：

| Key | Value |
|-----|-------|
| `ALLOWED_ORIGINS` | `https://你的前端URL` |

然后修改 `backend/app.py` 中的 CORS 配置：

```python
allowed_origins = os.environ.get("ALLOWED_ORIGINS", "*")
if allowed_origins != "*":
    CORS(app, origins=allowed_origins.split(","))
else:
    CORS(app)
```

#### 步骤 2：确保前端环境变量正确

再次确认前端的 `NEXT_PUBLIC_API_URL` 环境变量设置正确。

如果需要修改：
1. 进入前端服务的 Settings 页面
2. 找到 Environment 部分
3. 修改环境变量的值
4. 保存后会自动重新部署

---

### 5. 验证部署

#### 步骤 1：访问前端

在浏览器中打开前端 URL：
```
https://你的前端URL
```

#### 步骤 2：测试首页

1. 检查页面是否正常显示
2. 检查是否显示 "欢迎使用社区便民物品借用管理平台" 的欢迎语
3. 如果显示，说明后端 API 调用成功

#### 步骤 3：测试物品列表页

1. 点击 "查看/发布闲置物品" 链接
2. 检查是否显示物品列表
3. 尝试添加一个新物品，检查是否成功

#### 步骤 4：测试费用计算器

1. 点击 "租赁费用计算器" 链接
2. 输入天数和单价
3. 点击计算，检查结果是否正确

#### 步骤 5：记录部署信息

把以下信息记录到 README.md 中：

- 前端部署地址：________
- 后端 API 地址：________
- 部署日期：2026-07-13

---

## 方案二：Vercel 前端 + Render 后端

Vercel 是 Next.js 官方推荐的部署平台，对 Next.js 支持最好。

### 前端部署到 Vercel

#### 步骤 1：注册 Vercel 账号

1. 访问 [https://vercel.com/](https://vercel.com/)
2. 点击 "Sign Up"，用 GitHub 账号登录

#### 步骤 2：导入项目

1. 登录后点击 "Add New..." → "Project"
2. 找到你的 GitHub 仓库，点击 "Import"

#### 步骤 3：配置项目

| 配置项 | 值 |
|--------|-----|
| **Project Name** | `community-goods-frontend` |
| **Framework Preset** | `Next.js`（应该会自动检测） |
| **Root Directory** | 点击 "Edit"，输入 `frontend` |

#### 步骤 4：添加环境变量

在 "Environment Variables" 部分添加：

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_API_URL` | `https://你的后端URL` | Production, Preview, Development |

#### 步骤 5：部署

1. 点击 "Deploy" 按钮
2. 等待部署完成（大约 2-5 分钟）
3. 部署成功后会获得一个 `.vercel.app` 域名

#### 步骤 6：验证

访问 Vercel 提供的 URL，测试所有功能。

---

## 方案三：ngrok 内网穿透（本地演示用）

如果你暂时无法部署到云平台，可以使用 ngrok 将本地服务暴露到公网，作为临时演示方案。

### 步骤 1：注册 ngrok 账号

1. 访问 [https://ngrok.com/](https://ngrok.com/)
2. 注册一个免费账号
3. 登录后获取你的 authtoken

### 步骤 2：下载安装 ngrok

**Windows:**
1. 下载 ngrok Windows 版本
2. 解压到任意目录
3. 打开命令行，进入 ngrok 目录

**Mac/Linux:**
```bash
# 使用 brew 安装（Mac）
brew install ngrok

# 或手动下载
# 下载后解压，将 ngrok 放到 /usr/local/bin/
```

### 步骤 3：配置 authtoken

```bash
ngrok config add-authtoken 你的authtoken
```

### 步骤 4：启动本地后端服务

```bash
cd backend
python app.py
```

后端运行在 `http://127.0.0.1:5000`

### 步骤 5：启动本地前端服务

```bash
cd frontend
npm run dev
```

前端运行在 `http://localhost:3000`

### 步骤 6：使用 ngrok 暴露后端

新开一个终端窗口：

```bash
ngrok http 5000
```

ngrok 会给出一个公网 URL，类似：
```
Forwarding  https://xxxx-xx-xx-xx-xx.ngrok-free.app -> http://localhost:5000
```

**记录下这个 HTTPS URL**。

### 步骤 7：更新前端 API 地址

修改 `frontend/.env.local`：
```
NEXT_PUBLIC_API_URL=https://你的ngrok地址
```

然后重启前端服务。

### 步骤 8：暴露前端（可选）

如果需要让别人也能访问前端：

```bash
ngrok http 3000
```

### 注意事项

- ngrok 免费版地址每次重启都会变化
- 免费版有流量和连接数限制
- 仅适合临时演示，不适合长期使用

---

## 常见问题排查

### 问题 1：后端部署失败

**可能原因：**
- requirements.txt 缺少依赖
- 启动命令错误
- Python 版本不兼容

**解决方法：**
1. 查看 Render 的部署日志
2. 确认 `requirements.txt` 包含所有依赖
3. 确保 `gunicorn` 也在 requirements.txt 中

**添加 gunicorn 到 requirements.txt：**
```txt
Flask==2.3.3
Flask-CORS==4.0.0
gunicorn==21.2.0
```

### 问题 2：前端构建失败

**可能原因：**
- Node.js 版本不兼容
- 依赖安装失败
- 构建命令错误

**解决方法：**
1. 查看构建日志中的错误信息
2. 确认 package.json 中的依赖正确
3. 可以在 Render 中设置 Node 版本

**设置 Node 版本：**
在前端项目根目录创建 `frontend/.node-version` 文件：
```
18
```

### 问题 3：前端调用后端 API 失败

**可能原因：**
- 后端地址配置错误
- CORS 跨域问题
- 后端服务休眠中

**解决方法：**
1. 检查 `NEXT_PUBLIC_API_URL` 环境变量
2. 确认后端 URL 可以直接在浏览器中访问
3. 检查浏览器控制台的错误信息
4. 如果是 Render 免费版，首次访问需要等待后端唤醒

### 问题 4：数据库数据丢失

**原因：**
- Render 免费版的文件系统是临时的
- 每次重新部署，数据库文件会重置

**解决方法（任选其一）：**

1. **接受数据丢失**（学生项目可以接受）
   - 每次部署后数据库会重新初始化
   - 有默认的测试数据

2. **使用外部数据库**（进阶）
   - 可以使用免费的 SQLite 替代品
   - 或使用 Render 的 PostgreSQL 服务

### 问题 5：前端页面显示空白

**可能原因：**
- JavaScript 加载失败
- API 调用出错
- React 渲染错误

**解决方法：**
1. 打开浏览器开发者工具（F12）
2. 查看 Console 标签页的错误信息
3. 查看 Network 标签页的请求状态

---

## 部署后检查清单

部署完成后，按照以下清单检查：

- [ ] 后端 URL 可以直接访问，返回 JSON
- [ ] 前端 URL 可以正常打开
- [ ] 首页显示欢迎语（证明 API 调用成功）
- [ ] 物品列表页显示物品列表
- [ ] 可以新增物品
- [ ] 费用计算器可以正常计算
- [ ] README.md 中更新了部署地址
- [ ] 截图保存了部署成功的页面

---

## 有用的链接

- Render 控制台: [https://dashboard.render.com/](https://dashboard.render.com/)
- Vercel 控制台: [https://vercel.com/dashboard](https://vercel.com/dashboard)
- ngrok 官网: [https://ngrok.com/](https://ngrok.com/)
- Flask 部署文档: [https://flask.palletsprojects.com/deploying/](https://flask.palletsprojects.com/deploying/)
- Next.js 部署文档: [https://nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)

---

**祝你部署顺利！🎊**
