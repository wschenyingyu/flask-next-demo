# 社区便民物品借用管理平台

## 项目介绍

本平台旨在为小区邻里之间提供便捷的物品借用管理服务，用户可以登记闲置物品、发布借用需求、查看物品列表，并使用租赁费用计算器计算借用费用。

## 技术栈

- **后端**: Flask 2.3.3 + SQLite + Flask-CORS 4.0.0 + Gunicorn 21.2.0
- **前端**: Next.js 16.1.0 + TypeScript
- **部署**: Vercel（前端）+ Render（后端），详见 [DEPLOY.md](DEPLOY.md)

## 功能特性

1. **首页**: 平台介绍、快捷跳转入口
2. **闲置物品列表页**: 查看全部可借物品、新增闲置物品
3. **借用费用计算器**: 计算借用天数费用

## 项目结构

```
flask-next-demo/
├── backend/
│   ├── app.py            # Flask后端主文件
│   ├── wsgi.py           # Gunicorn入口文件
│   ├── requirements.txt  # Python依赖
│   ├── .env.example      # 环境变量示例
│   └── goods.db          # SQLite数据库（运行后自动生成）
├── frontend/
│   ├── app/
│   │   ├── page.tsx          # 首页
│   │   ├── goodslist/
│   │   │   └── page.tsx      # 物品列表页
│   │   ├── calc/
│   │   │   └── page.tsx      # 费用计算器页
│   │   ├── layout.tsx        # 布局组件
│   │   └── globals.css       # 全局样式
│   ├── lib/
│   │   └── api.ts            # API地址统一配置
│   ├── .env.local.example    # 前端环境变量示例
│   ├── package.json
│   ├── tsconfig.json
│   └── next.config.mjs
├── render.yaml              # Render部署配置
├── README.md
├── DEPLOY.md                # 部署指南
├── API_DOC.md
└── prompt_log.md
```

## 本地启动步骤

### 后端启动

```bash
cd backend
pip install -r requirements.txt
python app.py
```

后端服务将在 http://127.0.0.1:5000 启动

### 前端启动

```bash
cd frontend
npm install
npm run dev
```

前端服务将在 http://localhost:3000 启动

## API接口说明

详见 API_DOC.md

## 线上访问

- **前端地址（Vercel）**: 待部署后更新
- **后端API地址（Render）**: 待部署后更新

部署步骤详见 [DEPLOY.md](DEPLOY.md)

## 实训考核材料

1. Git提交记录（3个不同日期）
2. API文档（API_DOC.md）
3. AI开发日志（prompt_log.md）
4. 项目演示录屏（本地运行演示）