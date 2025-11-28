# 🎯 开始使用 - 数独游戏项目

> 欢迎！这是你的项目入口文档
> 
> **在线体验：** https://shudu-eosin.vercel.app  
> **项目状态：** ✅ 已部署上线

---

## 📋 目录

1. [项目概述](#项目概述)
2. [快速开始](#快速开始)
3. [文档导航](#文档导航)
4. [开发指南](#开发指南)
5. [部署说明](#部署说明)

---

## 项目概述

这是一个功能完整的在线数独游戏，支持：
- ✅ 用户注册和登录
- ✅ 三种难度（简单、中等、困难）
- ✅ 游戏历史记录
- ✅ 排行榜功能
- ✅ 响应式设计

### 技术栈

**前端：** React 18 + TypeScript + Vite  
**后端：** Node.js + Express + SQLite  
**部署：** Vercel (前端) + Railway (后端)

---

## 快速开始

### 本地开发（3步）

1. **安装依赖**
   ```bash
   npm install
   ```

2. **启动开发服务器**
   ```bash
   npm run dev
   ```

3. **访问应用**
   - 前端：http://localhost:5173
   - 后端：http://localhost:8080

### 构建生产版本

```bash
# 构建前端和后端
npm run build

# 仅构建前端
npm run build -w web

# 仅构建后端
npm run build -w server
```

---

## 文档导航

### 🎯 我想...

**开始开发**
→ [开发指南](./docs/guides/DEVELOPMENT_GUIDE.md)
→ [项目结构](./PROJECT_STRUCTURE.md)

**部署应用**
→ [部署复盘](./docs/deployment/FULL_STACK_DEPLOYMENT_REVIEW.md)
→ [Railway 指南](./docs/deployment/RAILWAY_GUIDE.md)
→ [Vercel 指南](./docs/deployment/VERCEL_GUIDE.md)

**解决问题**
→ [故障排查](./docs/guides/TROUBLESHOOTING.md)
→ [常见问题](./docs/deployment/RAILWAY_GUIDE.md#常见问题)

**了解产品**
→ [产品需求](./docs/product/prd.md)
→ [技术规格](./docs/product/spec.md)

### 📚 完整文档列表

| 类别 | 文档 | 说明 |
|------|------|------|
| **入门** | [README.md](./README.md) | 项目概述 |
| **入门** | [START_HERE.md](./START_HERE.md) | 本文件 |
| **结构** | [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) | 项目结构 |
| **产品** | [PRD.md](./docs/product/prd.md) | 产品需求文档 |
| **产品** | [SPEC.md](./docs/product/spec.md) | 技术规格说明 |
| **部署** | [部署复盘](./docs/deployment/FULL_STACK_DEPLOYMENT_REVIEW.md) | 完整部署过程 |
| **部署** | [Railway 指南](./docs/deployment/RAILWAY_GUIDE.md) | 后端部署 |
| **部署** | [Vercel 指南](./docs/deployment/VERCEL_GUIDE.md) | 前端部署 |
| **开发** | [开发指南](./docs/guides/DEVELOPMENT_GUIDE.md) | 开发规范 |
| **开发** | [故障排查](./docs/guides/TROUBLESHOOTING.md) | 问题解决 |

---

## 开发指南

### 项目结构

```
shudu/
├── web/          # 前端应用 (React + Vite)
├── server/       # 后端 API (Express + SQLite)
├── docs/         # 文档
└── package.json  # Workspace 配置
```

### 开发流程

1. **创建功能分支**
   ```bash
   git checkout -b feature/your-feature
   ```

2. **开发和测试**
   ```bash
   npm run dev
   ```

3. **提交代码**
   ```bash
   git add .
   git commit -m "feat: your feature description"
   git push origin feature/your-feature
   ```

4. **创建 Pull Request**

### 代码规范

- TypeScript 严格模式
- ESLint 检查
- 组件化开发
- 文档优先

---

## 部署说明

### 生产环境架构

```
用户浏览器
    ↓
Vercel (前端)
https://shudu-eosin.vercel.app
    ↓
Railway (后端)
https://shudu-production.up.railway.app
    ↓
SQLite 数据库
```

### 快速部署

#### 后端部署到 Railway

1. 访问 [railway.app](https://railway.app)
2. 连接 GitHub 仓库
3. 设置 Root Directory: `server`
4. 添加环境变量
5. 生成域名

**详细步骤：** [Railway 部署指南](./docs/deployment/RAILWAY_GUIDE.md)

#### 前端部署到 Vercel

1. 访问 [vercel.com](https://vercel.com)
2. 导入 GitHub 仓库
3. 设置 Root Directory: `web`
4. 添加环境变量
5. 部署

**详细步骤：** [Vercel 部署指南](./docs/deployment/VERCEL_GUIDE.md)

### 环境变量配置

**Railway（后端）：**
```bash
NODE_ENV=production
JWT_SECRET=<随机生成>
CLIENT_ORIGIN=https://shudu-eosin.vercel.app
```

**Vercel（前端）：**
```bash
VITE_API_URL=https://shudu-production.up.railway.app
```

---

## 常见任务

### 添加新功能

1. 阅读 [PRD](./docs/product/prd.md) 了解需求
2. 查看 [SPEC](./docs/product/spec.md) 了解技术实现
3. 参考 [开发指南](./docs/guides/DEVELOPMENT_GUIDE.md)
4. 编写代码和测试
5. 更新文档

### 修复 Bug

1. 查看 [故障排查](./docs/guides/TROUBLESHOOTING.md)
2. 复现问题
3. 定位原因
4. 修复并测试
5. 提交 PR

### 更新文档

1. 修改相关文档
2. 更新时间戳
3. 更新 [docs/README.md](./docs/README.md)
4. 提交变更

---

## 获取帮助

### 文档资源

- **文档中心**：[docs/README.md](./docs/README.md)
- **API 文档**：[README.md#API文档](./README.md#api-文档)
- **部署文档**：[docs/deployment/](./docs/deployment/)

### 在线资源

- **在线演示**：https://shudu-eosin.vercel.app
- **GitHub 仓库**：https://github.com/aramisjiang-wq/Shudu
- **问题反馈**：[GitHub Issues](https://github.com/aramisjiang-wq/Shudu/issues)

### 联系方式

- **项目作者**：Dong
- **GitHub**：[@aramisjiang-wq](https://github.com/aramisjiang-wq)

---

## 下一步

### 新用户

1. ✅ 阅读 [README.md](./README.md) 了解项目
2. ✅ 查看 [项目结构](./PROJECT_STRUCTURE.md)
3. ✅ 运行 `npm run dev` 启动项目
4. ✅ 阅读 [开发指南](./docs/guides/DEVELOPMENT_GUIDE.md)

### 开发者

1. ✅ 熟悉 [PRD](./docs/product/prd.md) 和 [SPEC](./docs/product/spec.md)
2. ✅ 了解代码结构
3. ✅ 开始开发功能
4. ✅ 参考 [故障排查](./docs/guides/TROUBLESHOOTING.md)

### 部署人员

1. ✅ 阅读 [部署复盘](./docs/deployment/FULL_STACK_DEPLOYMENT_REVIEW.md)
2. ✅ 按照 [Railway 指南](./docs/deployment/RAILWAY_GUIDE.md) 部署后端
3. ✅ 按照 [Vercel 指南](./docs/deployment/VERCEL_GUIDE.md) 部署前端
4. ✅ 测试所有功能

---

<div align="center">

**🎉 开始你的数独之旅！**

Made with ❤️ by Dong

</div>
