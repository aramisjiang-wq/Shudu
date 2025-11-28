# 🚀 数独游戏 - 部署指南

## 📋 目录
- [部署前准备](#部署前准备)
- [Vercel 部署（推荐）](#vercel-部署推荐)
- [其他部署方案](#其他部署方案)
- [常见问题](#常见问题)

---

## 部署前准备

### 1. 构建测试
确保项目可以正常构建：

```bash
# 安装依赖
npm install

# 构建前端
npm run build -w web

# 构建后端
npm run build -w server
```

### 2. 环境变量
复制 `env.example` 并根据需要修改：

```bash
cp env.example .env
```

---

## Vercel 部署（推荐）

### 为什么选择 Vercel？
- ✅ 支持全栈应用（前端 + Serverless API）
- ✅ 自动 HTTPS 和 CDN
- ✅ 零配置部署
- ✅ 免费额度充足
- ✅ GitHub 集成

### 部署步骤

#### 方法 1：通过 Vercel Dashboard（推荐新手）

1. **访问 Vercel**
   - 打开 [vercel.com](https://vercel.com)
   - 使用 GitHub 账号登录

2. **导入项目**
   - 点击 "Add New Project"
   - 选择你的 GitHub 仓库
   - 点击 "Import"

3. **配置项目**
   ```
   Framework Preset: Other
   Root Directory: ./
   Build Command: npm run vercel-build
   Output Directory: web/dist
   Install Command: npm install
   ```

4. **设置环境变量**
   在 "Environment Variables" 中添加：
   
   | 变量名 | 值 | 说明 |
   |-------|---|------|
   | `JWT_SECRET` | `your-random-secret-key-here` | JWT 密钥（至少 32 字符） |
   | `CLIENT_ORIGIN` | `https://your-app.vercel.app` | 前端域名（部署后填写） |
   | `NODE_ENV` | `production` | 生产环境标识 |

5. **部署**
   - 点击 "Deploy"
   - 等待 2-3 分钟
   - 部署完成后会获得一个 `.vercel.app` 域名

6. **更新 CLIENT_ORIGIN**
   - 复制部署后的域名（如 `https://your-app.vercel.app`）
   - 返回 Vercel 项目设置
   - 更新 `CLIENT_ORIGIN` 环境变量为该域名
   - 重新部署（Settings → Deployments → 最新部署 → Redeploy）

#### 方法 2：通过 Vercel CLI（推荐开发者）

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录
vercel login

# 部署
vercel

# 设置环境变量
vercel env add JWT_SECRET
vercel env add CLIENT_ORIGIN
vercel env add NODE_ENV

# 生产部署
vercel --prod
```

### Vercel 配置说明

项目已包含 `vercel.json` 配置文件：

```json
{
  "version": 2,
  "builds": [
    {
      "src": "web/package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "web/dist" }
    },
    {
      "src": "api/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "/api/index.ts" },
    { "src": "/(.*\\..+)", "dest": "/web/dist/$1" },
    { "src": "/(.*)", "dest": "/web/dist/index.html" }
  ]
}
```

**工作原理：**
- 前端构建为静态文件（`web/dist`）
- 后端 API 转换为 Serverless Functions（`api/index.ts`）
- 所有 `/api/*` 请求路由到后端
- 其他请求返回前端静态文件

---

## 其他部署方案

### 方案 A：Render（全栈）

**优点：** 免费、支持 PostgreSQL、持久化存储

**步骤：**
1. 访问 [render.com](https://render.com)
2. 创建 Web Service
3. 连接 GitHub 仓库
4. 配置：
   ```
   Build Command: npm install && npm run build
   Start Command: npm start
   ```
5. 添加环境变量（同 Vercel）

### 方案 B：Railway（全栈）

**优点：** 简单、支持数据库、自动部署

**步骤：**
1. 访问 [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. 选择仓库
4. 自动检测并部署
5. 添加环境变量

### 方案 C：分离部署

**前端：** Netlify / Vercel / GitHub Pages  
**后端：** Render / Railway / Heroku

**前端配置：**
修改 `web/src/services/api.ts`：
```typescript
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';
```

创建 `web/.env.production`：
```
VITE_API_URL=https://your-backend-api.com
```

---

## 数据库配置

### SQLite（默认 - 仅开发）
- ✅ 零配置
- ❌ 不支持 Vercel Serverless
- ❌ 数据会在重启后丢失

### PostgreSQL（生产推荐）

如需持久化数据，建议迁移到 PostgreSQL：

1. **创建数据库**
   - Vercel Postgres
   - Supabase
   - Neon
   - Render PostgreSQL

2. **安装依赖**
   ```bash
   npm install pg --workspace=server
   ```

3. **修改 `server/src/db.ts`**
   ```typescript
   import { Pool } from 'pg';
   
   const pool = new Pool({
     connectionString: process.env.DATABASE_URL,
   });
   ```

4. **添加环境变量**
   ```
   DATABASE_URL=postgresql://user:pass@host:5432/dbname
   ```

---

## 常见问题

### ❓ 部署后 API 调用失败

**原因：** CORS 配置或环境变量问题

**解决：**
1. 检查 `CLIENT_ORIGIN` 环境变量是否正确
2. 确保前端域名与环境变量匹配
3. 查看 Vercel 部署日志

### ❓ 数据库连接失败

**原因：** SQLite 不支持 Serverless

**解决：**
- 使用 Vercel Postgres
- 或迁移到 PostgreSQL（见上方）

### ❓ 登录后刷新页面丢失状态

**原因：** Cookie 配置问题

**解决：**
检查 `server/src/routes/auth.ts` 中的 cookie 配置：
```typescript
res.cookie('token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // HTTPS
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
});
```

### ❓ 构建失败

**常见原因：**
1. TypeScript 类型错误
2. 缺少依赖
3. 路径配置错误

**解决：**
```bash
# 本地测试构建
npm run build -w web
npm run build -w server

# 查看错误信息
npm run lint -w web
```

### ❓ GitHub Pages 无法使用

**原因：** GitHub Pages 只支持静态网站，不支持后端 API

**解决：** 使用 Vercel 或其他支持全栈的平台（见 `GITHUB_PAGES_NOTE.md`）

---

## 部署检查清单

部署前请确认：

- [ ] 本地构建成功（`npm run build`）
- [ ] 环境变量已配置
- [ ] `JWT_SECRET` 使用强密码（至少 32 字符）
- [ ] `CLIENT_ORIGIN` 设置为实际域名
- [ ] API 路由测试通过
- [ ] CORS 配置正确
- [ ] 数据库连接正常（如使用）

---

## 性能优化建议

### 1. 启用 CDN
Vercel 自动提供全球 CDN

### 2. 图片优化
使用 WebP 格式，启用懒加载

### 3. 代码分割
Vite 自动进行代码分割

### 4. 缓存策略
```typescript
// vercel.json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

---

## 监控与日志

### Vercel 日志
- Dashboard → Project → Deployments → View Function Logs

### 错误追踪
推荐集成：
- Sentry
- LogRocket
- Vercel Analytics

---

## 安全建议

1. **JWT_SECRET** 使用强随机密码
2. 启用 HTTPS（Vercel 自动提供）
3. 配置 CSP 头部
4. 定期更新依赖
5. 不要在代码中硬编码密钥

---

## 支持

遇到问题？
- 📧 提交 GitHub Issue
- 📖 查看 [Vercel 文档](https://vercel.com/docs)
- 💬 加入社区讨论

---

**祝部署顺利！🎉**

