# 社区便民物品借用管理平台

## 项目介绍

本平台旨在为小区邻里之间提供便捷的物品借用管理服务，用户可以登记闲置物品、发布借用需求、查看物品列表，并使用租赁费用计算器计算借用费用。

## 技术栈

- **前端**: Next.js 16.1.0 + TypeScript
- **后端**: Next.js API Routes（内置）
- **数据库**: JSON 文件存储（goods.json）
- **部署**: Vercel / Cloudflare Pages / Netlify

## 功能特性

1. **首页**: 平台介绍、快捷跳转入口
2. **闲置物品列表页**: 查看全部可借物品、新增闲置物品
3. **借用费用计算器**: 计算借用天数费用

## 项目结构

```
flask-next-demo/
├── app/
│   ├── api/
│   │   ├── index/route.ts      # 首页 API
│   │   ├── goods/route.ts      # 物品管理 API
│   │   ├── calc_rent/route.ts  # 费用计算 API
│   │   └── goods.json          # 物品数据存储
│   ├── goodslist/page.tsx      # 物品列表页
│   ├── calc/page.tsx           # 费用计算器页
│   ├── layout.tsx              # 布局组件
│   ├── globals.css             # 全局样式
│   └── page.tsx                # 首页
├── lib/
│   └── api.ts                  # API 基础地址配置
├── public/                     # 静态资源
├── package.json
├── tsconfig.json
├── next.config.mjs
└── README.md
```

## 本地启动步骤

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

前端服务将在 http://localhost:3000 启动

## API接口说明

详见 API_DOC.md

## 线上访问

### 🔗 当前部署地址

| 环境 | 地址 | 状态 |
|------|------|------|
| **生产环境** | https://flask-next-demo.vercel.app | ✅ 已部署 |
| **开发环境** | http://localhost:3000 | ✅ 本地运行 |

---

## 🚀 线上部署详细步骤

本项目是纯 Next.js 项目，可以一键部署到多个平台。以下提供三种部署方案，按推荐程度排序：

### 方案一：Vercel 部署（推荐，Next.js 官方平台）

#### 第 1 步：注册 Vercel 账号

1. 打开浏览器，访问 [https://vercel.com/](https://vercel.com/)
2. 点击右上角 **Sign Up**
3. 选择用 **GitHub 账号登录**（推荐，方便连接仓库）
4. 按照提示完成注册流程

#### 第 2 步：导入项目

1. 登录后进入 Vercel Dashboard
2. 点击 **Add New** → **Project**
3. 在 "Import Git Repository" 页面，找到你的 `flask-next-demo` 仓库
4. 如果找不到，点击 **Configure Vercel** → 选择你的仓库 → 点击 **Install**
5. 找到 `flask-next-demo` 后，点击 **Import**

#### 第 3 步：配置项目

1. **Project Name**: 可以保持默认或修改为 `community-goods-platform`
2. **Framework Preset**: 选择 `Next.js`（通常会自动检测）
3. **Root Directory**: **留空**（代码已经在仓库根目录）
4. **Build Command**: 默认 `npm run build`（无需修改）
5. **Output Directory**: 默认 `.next`（无需修改）

#### 第 4 步：添加环境变量（可选）

如果需要配置 API 地址（本项目不需要，因为 API 是内置的），可以在 Environment Variables 中添加：

| Key | Value |
|-----|-------|
| NEXT_PUBLIC_API_BASE_URL | https://你的域名/api |

#### 第 5 步：开始部署

1. 点击页面底部的 **Deploy** 按钮
2. Vercel 会自动开始构建和部署
3. 等待部署完成（大约 2-5 分钟）

#### 第 6 步：获取部署地址

部署成功后，你会看到：
- ✅ "Your project has been deployed"
- 部署地址，格式为 `https://你的项目名.vercel.app`

**示例**: `https://community-goods-platform.vercel.app`

#### 第 7 步：验证部署

在浏览器中访问部署地址，测试以下功能：

1. ✅ 首页显示 "欢迎使用社区便民物品借用管理平台"
2. ✅ 点击 "查看/发布闲置物品" 能看到物品列表
3. ✅ 可以新增物品
4. ✅ 点击 "租赁费用计算器" 能正常计算

#### 第 8 步：自定义域名（可选）

1. 在 Vercel 项目页面，点击 **Settings** → **Domains**
2. 输入你自己的域名（需要先在域名服务商添加 DNS 记录）

---

### 方案二：Cloudflare Pages 部署（国内访问更稳定）

#### 第 1 步：注册 Cloudflare 账号

1. 访问 [https://pages.cloudflare.com/](https://pages.cloudflare.com/)
2. 点击 **Sign Up**，用 GitHub 账号登录

#### 第 2 步：创建项目

1. 点击 **Create a project**
2. 选择 **Connect to Git**
3. 选择你的 `flask-next-demo` 仓库

#### 第 3 步：配置构建

| 配置项 | 值 |
|--------|-----|
| **Project name** | `community-goods-platform` |
| **Build command** | `npm run build` |
| **Build output directory** | `.next` |
| **Root directory** | `/`（留空或输入 `/`） |

#### 第 4 步：部署

1. 点击 **Save and Deploy**
2. 等待部署完成（大约 3-8 分钟）
3. 获取部署地址（格式：`https://你的项目名.pages.dev`）

---

### 方案三：Netlify 部署

#### 第 1 步：注册 Netlify 账号

1. 访问 [https://www.netlify.com/](https://www.netlify.com/)
2. 点击 **Sign Up**，用 GitHub 账号登录

#### 第 2 步：导入项目

1. 点击 **Add new site** → **Import an existing project**
2. 选择 GitHub → 选择 `flask-next-demo` 仓库

#### 第 3 步：配置构建

| 配置项 | 值 |
|--------|-----|
| **Build command** | `npm run build` |
| **Publish directory** | `.next` |

#### 第 4 步：部署

1. 点击 **Deploy site**
2. 获取部署地址

---

## 🔧 部署注意事项

### 1. 数据持久化

本项目使用 JSON 文件（`app/api/goods.json`）存储数据。部署到服务器时：
- **Vercel**: 文件系统是只读的，POST 请求会返回 500 错误
- **Cloudflare Pages**: 同样是只读文件系统
- **解决方案**: 对于实训项目，可以接受只读模式（仅展示数据），或使用外部数据库

### 2. 部署后更新

每次推送代码到 GitHub，平台会自动重新部署：

```bash
# 修改代码后
git add .
git commit -m "feat: 添加新功能"
git push origin main
```

### 3. 常见问题

**Q: 部署后页面显示空白？**
A: 检查浏览器控制台（F12），查看错误信息。可能是构建失败或 JavaScript 错误。

**Q: 访问不了部署地址？**
A: 可能是网络问题，尝试使用手机热点或 VPN。国内访问 Vercel 可能需要加速。

**Q: API 请求失败？**
A: 检查 API 路径是否正确，确认项目已经成功构建。

---

## 📝 实训考核材料

1. ✅ Git提交记录（3个不同日期）
2. ✅ API文档（API_DOC.md）
3. ✅ AI开发日志（prompt_log.md）
4. ✅ 项目演示录屏（本地运行演示）
5. ✅ 部署说明文档（DEPLOY.md, DEPLOY_GUIDE.md）

---

## 📞 技术支持

如有部署问题，请参考：
- [Next.js 部署文档](https://nextjs.org/docs/deployment)
- [Vercel 文档](https://vercel.com/docs)
- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)

---

*项目创建时间：2024年  
最后更新：2024年*