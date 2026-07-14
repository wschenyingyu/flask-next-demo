# 项目部署详细指南

## 目录

- [方案一：Vercel 部署（推荐）](#方案一vercel-部署推荐)
- [方案二：Cloudflare Pages 部署（国内访问更稳定）](#方案二cloudflare-pages-部署国内访问更稳定)
- [方案三：Netlify 部署](#方案三netlify-部署)
- [方案四：ngrok 内网穿透（本地演示用）](#方案四ngrok-内网穿透本地演示用)
- [常见问题排查](#常见问题排查)

---

## 方案一：Vercel 部署（推荐）

Vercel 是 Next.js 官方推荐的部署平台，对 Next.js 支持最好，部署最简单。

### 第 1 步：注册 Vercel 账号

1. 打开浏览器，访问 [https://vercel.com/](https://vercel.com/)
2. 点击右上角的 **Sign Up** 按钮
3. 在登录页面，选择 **Continue with GitHub**
4. 输入你的 GitHub 账号密码，授权 Vercel 访问你的 GitHub 账号
5. 完成注册流程

### 第 2 步：准备 GitHub 仓库

确保你的代码已经推送到 GitHub：

```bash
# 检查当前目录
cd /workspace

# 检查 Git 状态
git status

# 如果有未提交的更改，先提交
git add .
git commit -m "docs: 更新部署文档"

# 推送到 GitHub
git push origin main
```

### 第 3 步：导入项目到 Vercel

1. 登录 Vercel 后，进入 Dashboard 页面
2. 点击右上角的 **Add New** 按钮，选择 **Project**
3. 在 "Import Git Repository" 页面：
   - 找到你的 `flask-next-demo` 仓库
   - 如果找不到，点击 **Configure Vercel** 链接
   - 在 GitHub 授权页面，选择你的仓库，点击 **Install**
4. 找到 `flask-next-demo` 仓库后，点击 **Import** 按钮

### 第 4 步：配置项目

在项目配置页面，填写以下信息：

| 配置项 | 值 | 说明 |
|--------|-----|------|
| **Project Name** | `community-goods-platform` | 项目名称，会成为 URL 的一部分 |
| **Framework Preset** | `Next.js` | Vercel 会自动检测，无需手动选择 |
| **Root Directory** | 留空 | 代码已经在仓库根目录，不需要指定子目录 |
| **Build Command** | `npm run build` | 默认值，无需修改 |
| **Output Directory** | `.next` | 默认值，无需修改 |

### 第 5 步：添加环境变量（可选）

本项目是纯 Next.js 项目，API 是内置的，通常不需要添加环境变量。

如果需要配置 API 地址，可以点击 **Environment Variables** 部分的 **Add** 按钮：

| Key | Value | Environment |
|-----|-------|-------------|
| NEXT_PUBLIC_API_BASE_URL | https://你的域名/api | Production, Preview, Development |

### 第 6 步：开始部署

1. 确认所有配置正确后，点击页面底部的 **Deploy** 按钮
2. Vercel 会自动开始构建和部署你的项目
3. 部署过程大约需要 2-5 分钟
4. 你可以看到实时的构建日志

### 第 7 步：等待部署完成

1. 当部署成功时，会显示 ✅ "Your project has been deployed"
2. 页面顶部会显示你的部署地址，格式为：
   ```
   https://你的项目名.vercel.app
   ```
3. **记录下这个 URL**，这就是你的线上访问地址

**示例部署地址**: `https://community-goods-platform.vercel.app`

### 第 8 步：验证部署

在浏览器中访问你的部署地址，测试以下功能：

#### 测试 1：访问首页
```
https://你的域名
```
✅ 应该看到 "社区便民物品借用平台" 标题和欢迎语

#### 测试 2：测试首页 API
```
https://你的域名/api/index
```
✅ 应该返回 JSON：`{"msg":"欢迎使用社区便民物品借用管理平台"}`

#### 测试 3：测试物品列表 API
```
https://你的域名/api/goods
```
✅ 应该返回物品列表的 JSON 数据

#### 测试 4：测试物品列表页面
```
https://你的域名/goodslist
```
✅ 应该显示物品列表

#### 测试 5：测试费用计算器页面
```
https://你的域名/calc
```
✅ 应该显示费用计算器

### 第 9 步：更新 README.md（重要）

部署成功后，**必须**更新 README.md 中的部署地址：

1. 打开 `/workspace/README.md` 文件
2. 找到 "线上访问" 部分
3. 将 "部署后更新" 替换为你的实际部署地址
4. 提交并推送更改：

```bash
git add README.md
git commit -m "docs: 更新部署地址"
git push origin main
```

---

## 方案二：Cloudflare Pages 部署（国内访问更稳定）

Cloudflare Pages 在国内访问速度更快，更稳定。

### 第 1 步：注册 Cloudflare 账号

1. 访问 [https://pages.cloudflare.com/](https://pages.cloudflare.com/)
2. 点击 **Sign Up** 按钮
3. 使用 GitHub 账号登录

### 第 2 步：创建项目

1. 登录后，点击 **Create a project**
2. 选择 **Connect to Git**
3. 选择你的 `flask-next-demo` 仓库

### 第 3 步：配置构建

| 配置项 | 值 | 说明 |
|--------|-----|------|
| **Project name** | `community-goods-platform` | 项目名称 |
| **Build command** | `npm run build` | 构建命令 |
| **Build output directory** | `.next` | 构建输出目录 |
| **Root directory** | `/` | 根目录 |

### 第 4 步：部署

1. 点击 **Save and Deploy**
2. 等待部署完成（大约 3-8 分钟）
3. 获取部署地址（格式：`https://你的项目名.pages.dev`）

### 第 5 步：验证

按照方案一的验证步骤测试所有功能。

---

## 方案三：Netlify 部署

### 第 1 步：注册 Netlify 账号

1. 访问 [https://www.netlify.com/](https://www.netlify.com/)
2. 点击 **Sign Up**，用 GitHub 账号登录

### 第 2 步：导入项目

1. 点击 **Add new site** → **Import an existing project**
2. 选择 GitHub → 选择 `flask-next-demo` 仓库

### 第 3 步：配置构建

| 配置项 | 值 |
|--------|-----|
| **Build command** | `npm run build` |
| **Publish directory** | `.next` |

### 第 4 步：部署

1. 点击 **Deploy site**
2. 获取部署地址

---

## 方案四：ngrok 内网穿透（本地演示用）

如果你暂时无法部署到云平台，可以使用 ngrok 将本地服务暴露到公网。

### 第 1 步：注册 ngrok 账号

1. 访问 [https://ngrok.com/](https://ngrok.com/)
2. 注册免费账号
3. 登录后获取你的 authtoken

### 第 2 步：下载安装 ngrok

**Windows:**
1. 下载 ngrok Windows 版本
2. 解压到任意目录
3. 打开命令行，进入 ngrok 目录

**Mac/Linux:**
```bash
brew install ngrok
```

### 第 3 步：配置 authtoken

```bash
ngrok config add-authtoken 你的authtoken
```

### 第 4 步：启动本地服务

```bash
cd /workspace
npm run dev
```

前端运行在 http://localhost:3000

### 第 5 步：使用 ngrok 暴露服务

新开一个终端窗口：

```bash
ngrok http 3000
```

ngrok 会给出一个公网 URL，类似：
```
Forwarding  https://xxxx-xx-xx-xx-xx.ngrok-free.app -> http://localhost:3000
```

**记录下这个 HTTPS URL**，这就是你的临时线上访问地址。

### 注意事项

- ngrok 免费版地址每次重启都会变化
- 免费版有流量和连接数限制
- 仅适合临时演示，不适合长期使用

---

## 常见问题排查

### 问题 1：部署失败

**可能原因：**
- Node.js 版本不兼容
- 依赖安装失败
- 构建命令错误

**解决方法：**
1. 查看构建日志中的错误信息
2. 确认 package.json 中的依赖正确
3. 在 Vercel 中设置 Node 版本（建议 18+）

### 问题 2：页面显示空白

**可能原因：**
- JavaScript 加载失败
- React 渲染错误
- 构建失败

**解决方法：**
1. 打开浏览器开发者工具（F12）
2. 查看 Console 标签页的错误信息
3. 查看 Network 标签页的请求状态

### 问题 3：API 请求失败

**可能原因：**
- API 路径错误
- 构建失败
- 文件系统只读

**解决方法：**
1. 检查 API 路径是否正确
2. 确认项目已经成功构建
3. 如果是 POST 请求失败，可能是因为服务器文件系统只读（Vercel/Cloudflare Pages）

### 问题 4：国内无法访问部署地址

**可能原因：**
- Vercel 在国内被屏蔽
- 网络问题

**解决方法：**
1. 使用 Cloudflare Pages 部署（国内访问更稳定）
2. 使用手机热点或 VPN
3. 使用 ngrok 作为临时方案

### 问题 5：部署后数据丢失

**原因：**
- 本项目使用 JSON 文件存储数据
- Vercel/Cloudflare Pages 的文件系统是只读的
- POST 请求无法写入数据

**解决方法：**
1. 对于实训项目，可以接受只读模式（仅展示数据）
2. 使用外部数据库（如 Supabase、MongoDB Atlas 等）

---

## 部署后检查清单

部署完成后，按照以下清单检查：

- [ ] 部署地址可以正常访问
- [ ] 首页显示 "欢迎使用社区便民物品借用管理平台"
- [ ] 首页 API (`/api/index`) 返回 JSON
- [ ] 物品列表 API (`/api/goods`) 返回 JSON
- [ ] 物品列表页面显示物品列表
- [ ] 费用计算器页面可以正常计算
- [ ] README.md 中更新了部署地址
- [ ] 截图保存了部署成功的页面

---

## 有用的链接

- Vercel 控制台: [https://vercel.com/dashboard](https://vercel.com/dashboard)
- Cloudflare Pages: [https://pages.cloudflare.com/](https://pages.cloudflare.com/)
- Netlify: [https://www.netlify.com/](https://www.netlify.com/)
- ngrok: [https://ngrok.com/](https://ngrok.com/)
- Next.js 部署文档: [https://nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)

---

**祝你部署顺利！🎊**