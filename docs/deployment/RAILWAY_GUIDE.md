# 🚂 Railway 部署完整指南

> Railway 后端部署的详细步骤和故障排查

---

## 📋 目录

1. [快速开始](#快速开始)
2. [详细步骤](#详细步骤)
3. [配置说明](#配置说明)
4. [故障排查](#故障排查)
5. [常见问题](#常见问题)

---

## 快速开始

### 前置条件

- GitHub 账号
- Railway 账号（使用 GitHub 登录）
- 代码已推送到 GitHub

### 5 分钟部署

1. **创建项目**
   - 访问 [railway.app](https://railway.app)
   - 点击 "New Project" → "Deploy from GitHub repo"
   - 选择你的仓库

2. **配置服务**
   - 点击服务 → Settings
   - 设置 Root Directory: `server`

3. **添加环境变量**
   ```bash
   NODE_ENV=production
   JWT_SECRET=<生成随机密钥>
   CLIENT_ORIGIN=<你的前端域名>
   ```

4. **生成域名**
   - Settings → Networking → Generate Domain

5. **测试**
   ```bash
   curl https://你的域名/health
   ```

---

## 详细步骤

### 步骤 1：创建 Railway 项目

1. 访问 https://railway.app
2. 使用 GitHub 账号登录
3. 点击 "New Project"
4. 选择 "Deploy from GitHub repo"
5. 授权 Railway 访问你的 GitHub
6. 选择 `Shudu` 仓库
7. Railway 会自动创建项目

### 步骤 2：配置服务设置

#### 2.1 设置 Root Directory

这是**最关键**的配置！

1. 点击服务卡片进入详情
2. 点击顶部的 "Settings" 标签
3. 找到 "Root Directory" 输入框
4. 输入：`server`
5. 按回车保存

**为什么需要？**
```
项目结构：
/
├── server/  ← 后端代码在这里
└── web/     ← 前端代码

Railway 默认从 / 启动，找不到 server/package.json
设置 Root Directory = server 后，从 /server 启动
```

#### 2.2 验证构建配置

Railway 会自动检测以下配置（无需手动设置）：
- Build Command: `npm install && npm run build`
- Start Command: `npm start`
- Node.js 版本: 自动检测

### 步骤 3：配置环境变量

1. 点击 "Variables" 标签
2. 点击 "New Variable" 添加以下变量：

#### 变量 1：NODE_ENV
```
Name: NODE_ENV
Value: production
```

#### 变量 2：JWT_SECRET
```
Name: JWT_SECRET
Value: <生成随机密钥>
```

**生成密钥：**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### 变量 3：CLIENT_ORIGIN
```
Name: CLIENT_ORIGIN
Value: https://你的前端域名.vercel.app
```

### 步骤 4：生成公开域名

1. 点击 "Settings" 标签
2. 向下滚动到 "Networking" 部分
3. 点击 "Generate Domain" 按钮
4. 复制生成的域名（格式：`xxx.up.railway.app`）

### 步骤 5：等待部署完成

1. 点击 "Deployments" 标签
2. 查看最新部署状态
3. 等待状态变为 "Success" ✅

**预计时间：** 2-3 分钟

### 步骤 6：测试后端

在浏览器或终端测试：

```bash
# 健康检查
curl https://你的域名/health

# 应该返回
{"status":"ok","time":"2025-11-28T..."}
```

---

## 配置说明

### 配置文件

#### nixpacks.toml

位置：`server/nixpacks.toml`

```toml
[phases.setup]
nixPkgs = ["nodejs_20"]

[phases.install]
cmds = ["npm install"]

[phases.build]
cmds = ["npm run build"]

[start]
cmd = "npm start"
```

**说明：**
- `setup`: 安装 Node.js 20
- `install`: 安装依赖
- `build`: 编译 TypeScript
- `start`: 启动服务器

#### Procfile

位置：`server/Procfile`

```
web: npm start
```

**说明：**
- 定义 web 进程的启动命令
- Railway 会自动识别并使用

### 代码配置

#### 端口配置

`server/src/config.ts`:

```typescript
export const config = {
  // Railway 使用 PORT 环境变量
  port: Number(process.env.PORT ?? process.env.SERVER_PORT ?? 8080),
  jwtSecret: process.env.JWT_SECRET ?? 'replace-me',
  clientOrigin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173',
  nodeEnv: process.env.NODE_ENV ?? 'development',
};
```

**关键点：**
- 优先使用 `process.env.PORT`（Railway 自动设置）
- 提供本地开发的默认值

---

## 故障排查

### 问题 1：部署失败 - npm ci 错误

**错误信息：**
```
npm error code EUSAGE
npm ci command can only install with an existing package-lock.json
```

**原因：**
- Monorepo 结构没有 `server/package-lock.json`
- nixpacks 默认使用 `npm ci`

**解决方案：**
修改 `server/nixpacks.toml`：
```toml
[phases.install]
cmds = ["npm install"]  # 改用 npm install
```

---

### 问题 2：域名 404 - Cannot GET /

**错误信息：**
```
Cannot GET /
Cannot GET /api/health
```

**原因：**
- Root Directory 未设置
- Railway 从根目录启动，找不到代码

**解决方案：**
1. Settings → Root Directory → 输入 `server`
2. 等待自动重新部署
3. 测试：`curl https://你的域名/health`

---

### 问题 3：服务器启动但路由不工作

**症状：**
- 日志显示 "Server listening on http://localhost:8080"
- 但访问任何路由都返回 404

**可能原因：**
1. 路由路径错误
2. 中间件配置问题
3. CORS 配置阻止请求

**排查步骤：**

1. **检查路由定义**
   ```typescript
   // 确认路由路径
   app.get('/health', ...)  // 正确
   app.get('/api/health', ...)  // 如果是这个，访问 /api/health
   ```

2. **检查 CORS 配置**
   ```typescript
   app.use(cors({
     origin: config.clientOrigin,  // 确保包含你的前端域名
     credentials: true,
   }));
   ```

3. **查看部署日志**
   - Deployments → 最新部署 → View Logs
   - 查找错误信息

---

### 问题 4：数据库文件丢失

**症状：**
- 用户数据在重新部署后丢失
- SQLite 数据库文件不存在

**原因：**
- Railway 默认使用临时存储
- 重新部署会清空临时文件

**解决方案：**

**方案 A：使用 Railway Volumes（推荐）**
1. Settings → Volumes
2. 创建新 Volume
3. 挂载到 `/app/server/data`

**方案 B：迁移到 PostgreSQL**
```bash
# Railway 提供免费 PostgreSQL
railway add postgres
```

---

### 问题 5：环境变量未生效

**症状：**
- 代码中获取的环境变量是 undefined
- 使用了默认值而不是配置的值

**排查步骤：**

1. **确认变量已添加**
   - Variables 标签 → 检查所有变量

2. **检查变量名称**
   - 大小写敏感
   - 不要有空格

3. **重新部署**
   - 修改环境变量后需要重新部署
   - Deployments → Redeploy

4. **查看运行时日志**
   ```typescript
   console.log('Environment:', {
     NODE_ENV: process.env.NODE_ENV,
     JWT_SECRET: process.env.JWT_SECRET ? '已设置' : '未设置',
     CLIENT_ORIGIN: process.env.CLIENT_ORIGIN,
   });
   ```

---

## 常见问题

### Q: Railway 免费额度是多少？

**A:** 
- 每月 $5 免费额度
- 包含 500 小时运行时间
- 足够小型项目使用

### Q: 如何查看日志？

**A:**
1. 点击服务进入详情
2. 点击 "Deployments" 标签
3. 点击最新部署
4. 查看 "Build Logs" 和 "Deploy Logs"

### Q: 如何回滚到之前的版本？

**A:**
1. Deployments → 找到之前的成功部署
2. 点击 "..." → "Redeploy"

### Q: 如何删除服务？

**A:**
1. 服务详情 → Settings
2. 滚动到底部
3. 点击 "Delete Service"
4. 确认删除

### Q: 支持自定义域名吗？

**A:**
- 是的，在 Settings → Networking → Custom Domain
- 需要配置 DNS CNAME 记录

### Q: 如何监控服务状态？

**A:**
- Metrics 标签：查看 CPU、内存、网络使用情况
- 设置 Webhook 接收部署通知

---

## 部署检查清单

### 部署前

- [ ] 代码已推送到 GitHub
- [ ] 本地测试通过
- [ ] 环境变量已准备好

### 配置阶段

- [ ] Root Directory 设置为 `server`
- [ ] 环境变量已添加（NODE_ENV, JWT_SECRET, CLIENT_ORIGIN）
- [ ] 域名已生成

### 部署后

- [ ] 部署状态为 "Success"
- [ ] 健康检查通过（`/health`）
- [ ] 日志无错误
- [ ] API 端点可访问

### 功能测试

- [ ] 用户注册
- [ ] 用户登录
- [ ] 数据持久化
- [ ] CORS 正常工作

---

## 相关资源

- [Railway 官方文档](https://docs.railway.app)
- [Nixpacks 文档](https://nixpacks.com)
- [Node.js 部署最佳实践](https://docs.railway.app/guides/nodejs)

---

**文档版本：** 1.0.0  
**最后更新：** 2025-11-28  
**状态：** ✅ 已验证

