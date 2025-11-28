# ✅ Railway 部署检查清单

> 按顺序完成每一步，确保部署成功

---

## 📋 准备阶段

- [ ] GitHub 账号已登录
- [ ] 代码已推送到 GitHub
- [ ] 已生成 JWT 密钥：`94f7beaeab52119bb20da942bbde5df32b270baf08f93efb5b5d3234c272e8ea`

---

## 🚂 Railway 部署（10分钟）

### 第 1 步：创建 Railway 项目
- [ ] 访问 https://railway.app
- [ ] 使用 GitHub 登录
- [ ] 点击 "New Project"
- [ ] 选择 "Deploy from GitHub repo"
- [ ] 选择仓库：aramisjiang-wq/Shudu

### 第 2 步：配置环境变量
在 Railway 项目的 Variables 中添加：

- [ ] `NODE_ENV` = `production`
- [ ] `JWT_SECRET` = `94f7beaeab52119bb20da942bbde5df32b270baf08f93efb5b5d3234c272e8ea`
- [ ] `CLIENT_ORIGIN` = `https://shudu-eosin.vercel.app`
- [ ] `PORT` = `8080` (可选)

### 第 3 步：等待部署
- [ ] 等待构建完成（1-2分钟）
- [ ] 检查部署状态（应该显示 "Active"）
- [ ] 复制 Railway 域名（类似：https://xxx.up.railway.app）

### 第 4 步：测试后端
访问：`https://你的域名.up.railway.app/api/health`

- [ ] 返回 JSON：`{"status":"ok","time":"..."}`
- [ ] 状态码：200

---

## 🔗 连接前后端（5分钟）

### 方法 A：使用自动脚本（推荐）

```bash
cd /Users/dong/Documents/Cursor
./setup-frontend-api.sh https://你的Railway域名.up.railway.app
git add .
git commit -m "🔗 连接 Railway 后端"
git push origin main
```

- [ ] 脚本执行成功
- [ ] 已推送到 GitHub
- [ ] Vercel 开始自动部署

### 方法 B：手动配置

#### 1. 创建环境变量文件
```bash
cd web
echo "VITE_API_URL=https://你的Railway域名.up.railway.app" > .env.production
```

- [ ] 文件已创建

#### 2. 更新 API 服务
编辑 `web/src/services/api.ts`，在开头添加：

```typescript
const API_BASE = import.meta.env.VITE_API_URL || '';
```

修改 `request` 函数：
```typescript
const request = (input: RequestInfo, init?: RequestInit) =>
  fetch(`${API_BASE}${input}`, {  // 添加 API_BASE
    credentials: 'include',
    // ...
  });
```

- [ ] 代码已修改

#### 3. 推送更新
```bash
git add .
git commit -m "🔗 连接 Railway 后端"
git push origin main
```

- [ ] 已推送到 GitHub

---

## ✅ 验证部署（5分钟）

### 等待 Vercel 部署
- [ ] 访问 https://vercel.com/dashboard
- [ ] 查看部署状态
- [ ] 等待部署完成（约 2 分钟）

### 测试前端
访问：https://shudu-eosin.vercel.app

- [ ] 页面正常加载
- [ ] 没有控制台错误

### 测试完整功能
- [ ] 可以注册新用户
- [ ] 可以登录系统
- [ ] 可以开始游戏
- [ ] 可以完成游戏
- [ ] 可以查看历史记录
- [ ] 可以查看排行榜

---

## 🎉 部署完成！

如果所有检查项都已完成，恭喜你！

### 记录部署信息
```
部署日期：2025-11-28
Railway 后端：https://_____________________.up.railway.app
Vercel 前端：https://shudu-eosin.vercel.app
JWT 密钥：94f7beaeab52119bb20da942bbde5df32b270baf08f93efb5b5d3234c272e8ea
```

---

## 🐛 遇到问题？

### Railway 部署失败
- [ ] 查看 Build Logs
- [ ] 检查环境变量
- [ ] 确认 railway.json 配置

### 前端连接失败
- [ ] 检查 Railway 后端是否运行
- [ ] 检查 CORS 配置
- [ ] 查看浏览器控制台错误
- [ ] 确认 .env.production 文件正确

### 功能异常
- [ ] 查看 Railway Logs
- [ ] 检查数据库连接
- [ ] 验证 JWT_SECRET 配置

---

## 📚 相关文档

- [Railway 部署指南](./RAILWAY_DEPLOYMENT_GUIDE.md)
- [Vercel 部署说明](./VERCEL_DEPLOYMENT_NOTE.md)
- [问题排查手册](./docs/guides/TROUBLESHOOTING.md)

---

**祝部署顺利！** 🚀
