# 🚂 Railway 后端部署指南

> 5-10分钟完成后端部署

---

## 📋 准备工作

### 需要的账号
- ✅ GitHub 账号（已有）
- ✅ Railway 账号（用 GitHub 登录即可）

### 需要的信息
- ✅ GitHub 仓库：https://github.com/aramisjiang-wq/Shudu
- ✅ 前端地址：https://shudu-eosin.vercel.app

---

## 🚀 部署步骤

### 第 1 步：访问 Railway（1分钟）

1. 打开浏览器，访问：**https://railway.app**
2. 点击右上角 **"Login"**
3. 选择 **"Login with GitHub"**
4. 授权 Railway 访问你的 GitHub

### 第 2 步：创建新项目（2分钟）

1. 登录后，点击 **"New Project"**
2. 选择 **"Deploy from GitHub repo"**
3. 如果是第一次使用，点击 **"Configure GitHub App"**
4. 选择你的仓库：**aramisjiang-wq/Shudu**
5. 点击 **"Install & Authorize"**

### 第 3 步：配置项目（3分钟）

#### 3.1 选择服务目录
Railway 会自动检测到你的项目。如果有多个服务，选择 **server** 目录。

#### 3.2 设置构建命令
Railway 通常会自动检测，但如果需要手动设置：

```
Root Directory: server
Build Command: npm install && npm run build
Start Command: npm start
```

#### 3.3 配置环境变量
点击项目 → **Variables** 标签，添加以下变量：

| 变量名 | 值 | 说明 |
|-------|---|------|
| `NODE_ENV` | `production` | 生产环境 |
| `JWT_SECRET` | `生成的随机密钥` | JWT 密钥 |
| `CLIENT_ORIGIN` | `https://shudu-eosin.vercel.app` | 前端地址 |
| `PORT` | `8080` | 端口号（可选） |

**生成 JWT_SECRET：**
```bash
# 在终端运行
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

或使用这个随机生成的：
```
a7f8d9e2c4b6a1f3e5d7c9b2a4f6e8d0c2b4a6f8e0d2c4b6a8f0e2d4c6b8a0f2
```

### 第 4 步：部署（2分钟）

1. 点击 **"Deploy"** 按钮
2. 等待构建和部署（约 1-2 分钟）
3. 部署成功后，会显示一个 URL，类似：
   ```
   https://your-app-name.up.railway.app
   ```

### 第 5 步：获取后端地址（1分钟）

1. 在 Railway 项目页面，点击 **"Settings"** 标签
2. 找到 **"Domains"** 部分
3. 复制生成的域名，例如：
   ```
   https://shudu-production.up.railway.app
   ```

---

## 🔗 连接前后端

### 第 6 步：更新前端配置（5分钟）

#### 6.1 创建环境变量文件
在本地项目的 `web/` 目录创建 `.env.production`：

```bash
cd /Users/dong/Documents/Cursor/web
cat > .env.production << 'EOF'
VITE_API_URL=https://your-railway-app.up.railway.app
EOF
```

**替换 URL**：将 `your-railway-app` 替换为你的 Railway 域名

#### 6.2 修改 API 服务
编辑 `web/src/services/api.ts`，在文件开头添加：

```typescript
// API 基础地址
const API_BASE = import.meta.env.VITE_API_URL || '';

// 修改 request 函数
const request = (input: RequestInfo, init?: RequestInit) =>
  fetch(`${API_BASE}${input}`, {  // 添加 API_BASE
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  });
```

#### 6.3 推送更新
```bash
cd /Users/dong/Documents/Cursor
git add .
git commit -m "🔗 连接 Railway 后端 API"
git push origin main
```

Vercel 会自动检测并重新部署（约 1-2 分钟）。

---

## ✅ 验证部署

### 测试后端
访问你的 Railway 后端健康检查：
```
https://your-railway-app.up.railway.app/api/health
```

应该返回：
```json
{
  "status": "ok",
  "time": "2025-11-28T..."
}
```

### 测试前端
1. 访问：https://shudu-eosin.vercel.app
2. 尝试注册新用户
3. 登录系统
4. 开始游戏
5. 查看历史记录

---

## 🎯 完整流程总结

```
1. Railway 部署后端 (5分钟)
   ↓
2. 获取后端 URL
   ↓
3. 更新前端配置 (5分钟)
   ↓
4. 推送到 GitHub
   ↓
5. Vercel 自动部署 (2分钟)
   ↓
6. 测试完整功能 ✅
```

**总耗时：约 15-20 分钟**

---

## 🔧 Railway 配置文件（可选）

为了更好的配置，可以在项目根目录创建 `railway.json`：

```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "cd server && npm install && npm run build"
  },
  "deploy": {
    "startCommand": "cd server && npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

---

## 📊 Railway 优势

### 免费额度
- ✅ $5 免费额度/月
- ✅ 500 小时运行时间
- ✅ 足够个人项目使用

### 特点
- ✅ 自动检测框架
- ✅ 自动 HTTPS
- ✅ 自动部署（Git push）
- ✅ 内置数据库支持
- ✅ 简单的环境变量管理

### 监控
- ✅ 实时日志
- ✅ 资源使用监控
- ✅ 部署历史

---

## 🐛 常见问题

### Q: Railway 部署失败
**检查：**
1. 查看 Build Logs
2. 确认 `server/package.json` 中有 `build` 和 `start` 脚本
3. 检查环境变量是否正确

### Q: 前端连接后端失败
**检查：**
1. Railway 后端是否正常运行
2. `CLIENT_ORIGIN` 环境变量是否正确
3. 前端 `.env.production` 文件是否正确
4. CORS 配置是否包含前端域名

### Q: 数据库连接失败
**原因：** SQLite 在 Railway 上可能不持久化

**解决：**
1. 短期：接受数据重置（演示项目）
2. 长期：迁移到 PostgreSQL
   ```bash
   # 在 Railway 添加 PostgreSQL
   New → Database → Add PostgreSQL
   ```

### Q: 如何查看日志
1. 进入 Railway 项目
2. 点击 **"Deployments"**
3. 选择最新部署
4. 查看 **"Deploy Logs"** 和 **"Build Logs"**

---

## 🔄 后续优化

### 1. 添加数据库
```bash
# 在 Railway 项目中
New → Database → Add PostgreSQL
# 自动生成 DATABASE_URL 环境变量
```

### 2. 自定义域名
```bash
# Settings → Domains → Add Custom Domain
# 添加你的域名并配置 DNS
```

### 3. 监控和告警
```bash
# Settings → Notifications
# 配置部署失败通知
```

---

## 📞 获取帮助

### Railway 资源
- 📖 官方文档：https://docs.railway.app
- 💬 Discord 社区：https://discord.gg/railway
- 📧 支持邮箱：team@railway.app

### 项目文档
- 📚 [完整部署指南](./docs/deployment/DEPLOYMENT.md)
- 🔧 [问题排查](./docs/guides/TROUBLESHOOTING.md)

---

## ✨ 快速命令参考

```bash
# 生成 JWT 密钥
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 创建前端环境变量
echo "VITE_API_URL=https://your-app.up.railway.app" > web/.env.production

# 测试后端健康检查
curl https://your-app.up.railway.app/api/health

# 推送更新
git add . && git commit -m "更新配置" && git push
```

---

**准备好了吗？** 

1. 打开 https://railway.app
2. 按照上面的步骤操作
3. 有问题随时告诉我！

祝部署顺利！🚂✨

