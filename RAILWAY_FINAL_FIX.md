# 🎯 Railway 最终修复指南

## 📌 当前状态

✅ **已完成：**
- Railway 服务正在运行
- 域名已生成：`shudu-production.up.railway.app`
- 前端配置已更新
- 所有配置文件已推送

❌ **问题：**
- 访问 `/api/health` 返回 404
- Railway 没有从 `server/` 目录启动

---

## 🔧 解决方案

### 方法 1：在 Railway UI 设置 Root Directory（推荐）⭐

这是最简单、最可靠的方法！

#### 步骤：

1. **进入服务设置**
   ```
   Railway 项目 → 点击 "sudoku-server" → Settings
   ```

2. **找到 Service 部分**
   - 向下滚动找到 "Service" 或 "Source" 部分
   - 找到 **"Root Directory"** 输入框

3. **设置 Root Directory**
   - 在输入框中输入：`server`
   - 按回车或点击保存

4. **重新部署**
   - 滚动到底部
   - 点击 "Redeploy" 或 "Deploy"
   - 或者 Railway 会自动重新部署

5. **等待 2-3 分钟**
   - 查看 Deployments 标签
   - 等待状态变为 "Success"

6. **测试**
   ```
   https://shudu-production.up.railway.app/api/health
   ```
   应该看到：`{"status":"ok","time":"..."}`

---

### 方法 2：重新创建服务（如果方法1不行）

#### 步骤：

1. **删除现有服务**
   ```
   服务详情 → Settings → 滚动到底部 → "Delete Service"
   ```

2. **创建新服务**
   ```
   项目页面 → "+ New" → "GitHub Repo"
   ```

3. **配置新服务**
   - 选择仓库：`aramisjiang-wq/Shudu`
   - **重要：Root Directory 设置为 `server`**
   - 点击 "Deploy"

4. **添加环境变量**
   ```
   Variables 标签 → 添加：
   - NODE_ENV = production
   - JWT_SECRET = 94f7beaeab52119bb20da942bbde5df32b270baf08f93efb5b5d3234c272e8ea
   - CLIENT_ORIGIN = https://shudu-eosin.vercel.app
   ```

5. **生成域名**
   ```
   Settings → Networking → Generate Domain
   ```

6. **复制新域名并告诉我**
   - 我会更新前端配置

---

## 🔍 验证配置

### 检查 Root Directory 是否设置

在 Railway 服务的 Settings 页面，应该看到：

```
┌─────────────────────────────────────────────┐
│ Service                                     │
├─────────────────────────────────────────────┤
│ Name: sudoku-server                        │
│ Root Directory: server          ← 应该有这个 │
└─────────────────────────────────────────────┘
```

### 检查部署日志

在 Deployments → 最新部署 → Logs，应该看到：

```
✅ 正确的日志：
- Using Nixpacks
- setup | nodejs_20
- install | npm ci
- build | npm run build
- start | npm start
- Server listening on http://localhost:8080

❌ 错误的日志：
- npm error path /app/server
- Cannot find module
```

---

## 📊 完整配置清单

### Railway 环境变量
- [x] `NODE_ENV` = `production`
- [x] `JWT_SECRET` = `94f7beaeab52119bb20da942bbde5df32b270baf08f93efb5b5d3234c272e8ea`
- [x] `CLIENT_ORIGIN` = `https://shudu-eosin.vercel.app`

### Railway 服务配置
- [ ] **Root Directory** = `server` ← **关键！必须设置**
- [x] Domain = `shudu-production.up.railway.app`
- [x] Port = 自动检测（8080）

### 代码配置
- [x] `server/nixpacks.toml` - 构建配置
- [x] `server/Procfile` - 启动命令
- [x] `server/railway.json` - Railway 配置
- [x] `.railway/config.json` - 项目配置

### 前端配置
- [x] `web/.env.production` - API 地址
- [x] `web/src/services/api.ts` - API 配置

---

## 🎯 成功标志

### 后端测试
访问：`https://shudu-production.up.railway.app/api/health`

**成功：**
```json
{"status":"ok","time":"2025-11-28T21:00:30.123Z"}
```

**失败：**
```html
Cannot GET /api/health
```

### 前端测试
访问：`https://shudu-eosin.vercel.app`

**成功：**
- 页面正常加载
- 可以注册/登录
- 可以开始游戏
- 控制台无错误

---

## 🆘 故障排查

### 问题：找不到 Root Directory 设置

**解决：**
1. 确保你在**服务的 Settings**，不是项目的 Settings
2. 查找 "Service"、"Source" 或 "Build" 部分
3. 如果实在找不到，使用方法2重新创建服务

### 问题：设置了 Root Directory 还是 404

**解决：**
1. 确认拼写正确：`server`（小写，无空格）
2. 点击 Redeploy 重新部署
3. 查看部署日志确认从正确目录构建
4. 等待 2-3 分钟让部署完成

### 问题：部署失败

**解决：**
1. 查看 Deployments → 最新部署 → Logs
2. 找到错误信息
3. 常见错误：
   - "Cannot find module" → Root Directory 未设置
   - "npm error" → 检查 package.json
   - "Port in use" → Railway 会自动处理，忽略

---

## 📞 需要帮助

完成 Root Directory 设置后：

1. **等待 2-3 分钟**
2. **测试健康检查**：`https://shudu-production.up.railway.app/api/health`
3. **告诉我结果**：
   - ✅ 如果成功，我会测试前端
   - ❌ 如果失败，告诉我错误信息

---

## 💡 为什么需要 Root Directory？

```
你的仓库结构：
/
├── server/          ← 后端代码在这里
│   ├── package.json
│   ├── src/
│   └── dist/
├── web/             ← 前端代码
└── package.json     ← 根目录的 workspace 配置

Railway 默认从 / 开始：
❌ 找不到 server/package.json
❌ 找不到 server/dist/app.js
❌ 启动失败

设置 Root Directory = server 后：
✅ 从 /server 开始
✅ 找到 package.json
✅ 正确构建和启动
```

---

**现在去 Railway 设置 Root Directory = `server`，然后告诉我结果！** 🚀

