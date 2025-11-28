# GitHub Pages 部署说明

## ⚠️ 重要提示

**GitHub Pages 只能托管静态网站，不支持后端 API。**

如果使用 GitHub Pages 部署，你的应用将**无法正常工作**，因为：
- ❌ 无法运行 Express 服务器
- ❌ 无法使用数据库（SQLite）
- ❌ 无法进行用户认证
- ❌ 所有 API 调用都会失败

## 推荐方案

### ✅ 方案 1：使用 Vercel（推荐）
Vercel 支持全栈应用，可以同时托管前端和后端 API。

**部署步骤：**
1. 访问 [Vercel](https://vercel.com)
2. 导入你的 GitHub 仓库
3. 配置环境变量（见下方）
4. 点击部署

**必需的环境变量：**
```
JWT_SECRET=your-super-secret-key-here
CLIENT_ORIGIN=https://your-app.vercel.app
NODE_ENV=production
```

### ✅ 方案 2：分离部署
- **前端**：部署到 GitHub Pages / Netlify / Vercel
- **后端**：部署到 Render / Railway / Heroku

修改 `web/src/services/api.ts`，将 API 地址改为后端服务器地址：
```typescript
const API_BASE = 'https://your-backend-api.com';
```

### ❌ 方案 3：仅前端演示（功能受限）
如果只想展示 UI，可以：
1. 移除所有 API 调用
2. 使用本地存储（localStorage）模拟数据
3. 仅展示前端界面

## GitHub Pages 配置

如果你坚持使用 GitHub Pages（仅前端演示），需要：

1. 在 GitHub 仓库设置中启用 Pages
2. 选择 "GitHub Actions" 作为部署源
3. 推送代码后会自动部署

**访问地址：**
```
https://your-username.github.io/your-repo-name/
```

## 总结

| 部署平台 | 前端 | 后端 API | 数据库 | 推荐度 |
|---------|------|---------|--------|--------|
| Vercel | ✅ | ✅ | ⚠️ | ⭐⭐⭐⭐⭐ |
| GitHub Pages | ✅ | ❌ | ❌ | ⭐ |
| Render | ✅ | ✅ | ✅ | ⭐⭐⭐⭐ |
| Railway | ✅ | ✅ | ✅ | ⭐⭐⭐⭐ |

**强烈建议使用 Vercel 进行全栈部署！**

