# ⚡ Vercel 前端部署指南

> Vercel 前端部署的详细步骤和配置说明

---

## 📋 目录

1. [快速开始](#快速开始)
2. [详细步骤](#详细步骤)
3. [配置说明](#配置说明)
4. [故障排查](#故障排查)
5. [优化建议](#优化建议)

---

## 快速开始

### 3 分钟部署

1. **导入项目**
   - 访问 [vercel.com](https://vercel.com)
   - 点击 "Add New" → "Project"
   - 选择你的 GitHub 仓库

2. **配置项目**
   - Framework Preset: Vite
   - Root Directory: `web`
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **添加环境变量**
   ```
   VITE_API_URL=https://你的Railway域名
   ```

4. **部署**
   - 点击 "Deploy"
   - 等待 1-2 分钟

5. **测试**
   - 访问生成的域名
   - 测试所有功能

---

## 详细步骤

### 步骤 1：连接 GitHub 仓库

1. 访问 https://vercel.com
2. 使用 GitHub 账号登录
3. 点击 "Add New" → "Project"
4. 找到你的仓库 `Shudu`
5. 点击 "Import"

### 步骤 2：配置构建设置

#### 2.1 Framework Preset
选择 **"Vite"** 或 **"Other"**

#### 2.2 Root Directory
**重要！** 设置为 `web`

点击 "Edit" → 输入 `web` → 确认

**为什么需要？**
```
项目结构：
/
├── server/  ← 后端代码
└── web/     ← 前端代码在这里

Vercel 默认从 / 构建，找不到 web/package.json
设置 Root Directory = web 后，从 /web 构建
```

#### 2.3 Build Command
```bash
npm run build
```

#### 2.4 Output Directory
```
dist
```

#### 2.5 Install Command
```bash
npm install
```

### 步骤 3：配置环境变量

点击 "Environment Variables"，添加：

```
Name: VITE_API_URL
Value: https://你的Railway域名.up.railway.app
Environment: Production
```

**注意：**
- Vite 环境变量必须以 `VITE_` 开头
- 不要包含 `/api` 后缀
- 确保 Railway 后端已部署

### 步骤 4：部署

1. 点击 "Deploy" 按钮
2. Vercel 开始构建和部署
3. 等待 1-2 分钟

**构建过程：**
```
1. Cloning repository
2. Installing dependencies (npm install)
3. Building (npm run build)
4. Uploading to CDN
5. Deployment ready
```

### 步骤 5：获取域名

部署成功后，Vercel 会提供：
- 主域名：`项目名.vercel.app`
- 预览域名：`项目名-xxx.vercel.app`

### 步骤 6：测试应用

1. 访问你的域名
2. 测试以下功能：
   - [ ] 页面加载
   - [ ] 用户注册
   - [ ] 用户登录
   - [ ] 开始游戏
   - [ ] 查看历史
   - [ ] 查看排行榜

---

## 配置说明

### vercel.json

位置：项目根目录 `/vercel.json`

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**说明：**
- `rewrites`: 配置 URL 重写规则
- 所有路由都指向 `index.html`（支持 SPA 路由）

**为什么需要？**
- React Router 使用客户端路由
- 刷新页面时需要返回 `index.html`
- 否则会出现 404 错误

### 环境变量配置

#### 开发环境

`web/.env`:
```bash
VITE_API_URL=http://localhost:8080
```

#### 生产环境

`web/.env.production`:
```bash
VITE_API_URL=https://你的Railway域名.up.railway.app
```

#### 在代码中使用

`web/src/services/api.ts`:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const api = {
  baseURL: API_BASE_URL,
  
  async request(endpoint: string, options?: RequestInit) {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      credentials: 'include',  // 发送 cookies
    });
    return response;
  },
};
```

---

## 故障排查

### 问题 1：部署成功但 404

**症状：**
- 构建成功
- 访问域名返回 404

**可能原因：**
1. Root Directory 未设置
2. Output Directory 错误
3. 构建输出为空

**解决方案：**

**检查 Root Directory：**
1. Project Settings → General
2. Root Directory 应该是 `web`
3. 如果不是，修改并重新部署

**检查构建输出：**
1. Deployments → 最新部署 → Build Logs
2. 查找 "Build Completed"
3. 确认 `dist/` 目录有文件

**重新部署：**
1. Deployments → 最新部署
2. 点击 "..." → "Redeploy"

---

### 问题 2：API 请求失败 - CORS 错误

**错误信息：**
```
Access to fetch at 'https://...' from origin 'https://...' 
has been blocked by CORS policy
```

**原因：**
- 后端 CORS 配置不正确
- CLIENT_ORIGIN 环境变量错误

**解决方案：**

**1. 检查后端 CORS 配置**

`server/src/app.ts`:
```typescript
app.use(cors({
  origin: config.clientOrigin,  // 应该是你的 Vercel 域名
  credentials: true,
}));
```

**2. 检查 Railway 环境变量**
```
CLIENT_ORIGIN=https://你的项目.vercel.app
```

**3. 重新部署后端**
- Railway → Deployments → Redeploy

---

### 问题 3：环境变量未生效

**症状：**
- API 请求到 localhost
- 或使用了错误的 API 地址

**原因：**
- 环境变量未配置
- 环境变量名称错误
- 构建时未读取环境变量

**解决方案：**

**1. 检查 Vercel 环境变量**
- Project Settings → Environment Variables
- 确认 `VITE_API_URL` 存在
- Environment 选择 "Production"

**2. 重新部署**
- 修改环境变量后必须重新部署
- Deployments → Redeploy

**3. 验证构建日志**
```bash
# 构建日志应该显示
> Building for production...
> VITE_API_URL: https://...
```

---

### 问题 4：路由刷新 404

**症状：**
- 首页可以访问
- 点击链接正常
- 刷新页面返回 404

**原因：**
- 缺少 `vercel.json` 配置
- rewrites 规则未生效

**解决方案：**

**1. 创建 vercel.json**
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**2. 推送到 GitHub**
```bash
git add vercel.json
git commit -m "Add vercel.json"
git push
```

**3. 等待自动部署**

---

### 问题 5：构建失败 - 依赖错误

**错误信息：**
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**原因：**
- 依赖版本冲突
- package-lock.json 过时

**解决方案：**

**1. 本地修复依赖**
```bash
cd web
rm -rf node_modules package-lock.json
npm install
npm run build  # 确保本地构建成功
```

**2. 推送更新**
```bash
git add package-lock.json
git commit -m "Update dependencies"
git push
```

---

## 优化建议

### 1. 性能优化

#### 代码分割
```typescript
// 使用 React.lazy 动态导入
const GamePage = lazy(() => import('./pages/GamePage'));
const HistoryPage = lazy(() => import('./pages/HistoryPage'));
```

#### 资源优化
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
        },
      },
    },
  },
});
```

### 2. 缓存策略

#### vercel.json
```json
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

### 3. 环境变量管理

#### 多环境配置
```bash
# .env.development
VITE_API_URL=http://localhost:8080

# .env.staging
VITE_API_URL=https://staging-api.railway.app

# .env.production
VITE_API_URL=https://production-api.railway.app
```

### 4. 预览部署

Vercel 自动为每个 PR 创建预览部署：
- 独立的 URL
- 独立的环境变量
- 便于测试和审查

---

## 部署检查清单

### 配置阶段

- [ ] Root Directory 设置为 `web`
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`
- [ ] 环境变量已添加（VITE_API_URL）

### 部署后

- [ ] 部署状态为 "Ready"
- [ ] 域名可访问
- [ ] 页面正常加载
- [ ] 无控制台错误

### 功能测试

- [ ] 路由切换正常
- [ ] API 请求成功
- [ ] 用户认证工作
- [ ] 数据显示正确
- [ ] 刷新页面正常

---

## 相关资源

- [Vercel 官方文档](https://vercel.com/docs)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html)
- [React 部署最佳实践](https://react.dev/learn/start-a-new-react-project#deploying-to-production)

---

**文档版本：** 1.0.0  
**最后更新：** 2025-11-28  
**状态：** ✅ 已验证

