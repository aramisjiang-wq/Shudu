# 🚀 Vercel 部署说明

## 📌 当前状态

### 部署方式
当前配置为**仅前端部署**（静态网站）

### 原因
全栈部署在 Vercel 上需要特殊配置，为了快速解决 404 问题，我们先部署前端。

---

## ⚠️ 重要说明

### 当前配置
```json
{
  "version": 2,
  "builds": [
    {
      "src": "web/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ]
}
```

### 这意味着
- ✅ **前端**：可以正常访问和显示
- ❌ **后端 API**：无法运行（会返回 404）
- ❌ **用户功能**：注册、登录、游戏保存等功能不可用

---

## 🔧 解决方案

### 方案 A：分离部署（推荐）

#### 1. 前端部署到 Vercel（当前）
- 已完成 ✅
- 访问：https://shudu-eosin.vercel.app

#### 2. 后端部署到其他平台
推荐使用以下平台之一：

**Railway（推荐）**
```bash
# 1. 访问 railway.app
# 2. 连接 GitHub 仓库
# 3. 选择 server 目录
# 4. 自动部署
```

**Render**
```bash
# 1. 访问 render.com
# 2. 创建 Web Service
# 3. 连接 GitHub
# 4. 设置：
#    Build Command: cd server && npm install && npm run build
#    Start Command: cd server && npm start
```

**Heroku**
```bash
# 1. 创建 Heroku 应用
# 2. 添加 Procfile
# 3. 推送部署
```

#### 3. 更新前端 API 地址
修改 `web/src/services/api.ts`：
```typescript
const API_BASE = import.meta.env.VITE_API_URL || 'https://your-backend-url.com';
```

创建 `web/.env.production`：
```
VITE_API_URL=https://your-backend-api.com
```

---

### 方案 B：Vercel 全栈部署（复杂）

需要将后端改造为 Serverless Functions：

#### 1. 创建 API 路由
```
api/
├── auth/
│   ├── login.ts
│   ├── register.ts
│   └── me.ts
├── puzzle/
│   └── new.ts
└── ...
```

#### 2. 每个文件导出 handler
```typescript
// api/auth/login.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // 处理登录逻辑
}
```

#### 3. 更新 vercel.json
```json
{
  "rewrites": [
    { "source": "/api/:path*", "destination": "/api/:path*" }
  ]
}
```

**缺点：**
- 需要大量重构
- SQLite 不支持（需要迁移到 PostgreSQL）
- 复杂度高

---

## 🎯 推荐步骤

### 立即可做
1. **测试前端**
   - 访问 https://shudu-eosin.vercel.app
   - 查看 UI 是否正常显示
   - 确认静态资源加载

2. **了解限制**
   - 前端可以访问
   - 后端功能不可用
   - 这是临时状态

### 短期（1-2天）
1. **选择后端部署平台**
   - Railway（最简单）
   - Render（免费 PostgreSQL）
   - Heroku（经典选择）

2. **部署后端**
   - 按照平台文档部署
   - 配置环境变量
   - 测试 API 接口

3. **连接前后端**
   - 更新前端 API 地址
   - 配置 CORS
   - 重新部署前端

### 长期（1周+）
1. **迁移到 PostgreSQL**
   - SQLite 不适合生产环境
   - 使用 Vercel Postgres 或 Supabase

2. **优化性能**
   - CDN 配置
   - 缓存策略
   - 图片优化

3. **监控和日志**
   - 集成 Sentry
   - 配置日志系统
   - 性能监控

---

## 📚 相关文档

- [完整部署指南](./docs/deployment/DEPLOYMENT.md)
- [快速部署](./docs/deployment/QUICK_DEPLOY.md)
- [问题排查](./docs/guides/TROUBLESHOOTING.md)

---

## 🆘 常见问题

### Q: 为什么前端可以访问但功能不可用？
A: 当前只部署了前端静态文件，后端 API 还没有部署。

### Q: 如何让所有功能正常工作？
A: 需要部署后端到支持 Node.js 的平台（Railway/Render/Heroku）。

### Q: 能在 Vercel 上全栈部署吗？
A: 可以，但需要大量重构，将 Express 改造为 Serverless Functions。

### Q: 最快的解决方案是什么？
A: 使用 Railway 部署后端（5-10分钟），然后更新前端 API 地址。

---

## 🔗 有用的链接

- **Railway**: https://railway.app
- **Render**: https://render.com
- **Vercel Docs**: https://vercel.com/docs
- **Vercel Postgres**: https://vercel.com/docs/storage/vercel-postgres

---

**更新时间**：2025-11-28  
**状态**：前端已部署，后端待部署

**下一步**：选择后端部署平台并部署

