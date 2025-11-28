# ⚡ 快速部署指南（5分钟）

## 🎯 目标
将数独游戏部署到 Vercel，获得一个可访问的在线地址。

## 📋 前置条件
- ✅ GitHub 账号
- ✅ 代码已推送到 GitHub
- ✅ 有 Vercel 账号（没有的话用 GitHub 登录即可）

---

## 🚀 部署步骤

### 1️⃣ 检查配置（1分钟）

```bash
# 运行检查脚本
npm run check-deploy
```

如果看到 "🎉 配置检查通过"，继续下一步。

### 2️⃣ 推送到 GitHub（1分钟）

```bash
git add .
git commit -m "准备部署到 Vercel"
git push origin main
```

### 3️⃣ 部署到 Vercel（3分钟）

#### 步骤 A：导入项目
1. 访问 https://vercel.com
2. 点击 "Add New Project"
3. 选择你的 GitHub 仓库（Shudu）
4. 点击 "Import"

#### 步骤 B：配置项目
保持默认配置，直接点击 "Deploy"

#### 步骤 C：配置环境变量
部署完成后：
1. 进入项目 Settings → Environment Variables
2. 添加以下变量：

```
JWT_SECRET = 你的随机密钥（至少32字符，可以用下面的命令生成）
CLIENT_ORIGIN = https://your-app.vercel.app （复制你的 Vercel 域名）
NODE_ENV = production
```

**生成随机密钥：**
```bash
# 在终端运行
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### 步骤 D：重新部署
1. 返回 Deployments 页面
2. 点击最新部署右侧的 "..." 菜单
3. 选择 "Redeploy"
4. 等待 1-2 分钟

### 4️⃣ 完成！🎉

访问你的 Vercel 域名（如 `https://shudu-xxx.vercel.app`），开始游戏！

---

## 🔧 常见问题

### ❓ 部署失败怎么办？

**查看日志：**
1. Vercel Dashboard → 你的项目
2. Deployments → 失败的部署
3. 点击查看 "Build Logs"

**常见错误：**
- `Build failed`: 检查代码是否有语法错误
- `Command not found`: 确保 package.json 中有 `vercel-build` 脚本
- `Module not found`: 运行 `npm install` 确保依赖完整

### ❓ 部署成功但无法登录？

**原因：** 环境变量未配置

**解决：**
1. 检查 `JWT_SECRET` 是否已设置
2. 检查 `CLIENT_ORIGIN` 是否与实际域名一致
3. 重新部署

### ❓ API 调用失败？

**检查：**
1. 打开浏览器开发者工具（F12）
2. 查看 Network 标签
3. 检查 API 请求是否返回 CORS 错误

**解决：**
确保 `CLIENT_ORIGIN` 环境变量正确设置为你的前端域名。

---

## 📊 部署检查清单

部署前确认：
- [ ] 代码已推送到 GitHub
- [ ] 本地构建成功（`npm run build -w web`）
- [ ] `vercel.json` 文件存在
- [ ] `api/index.ts` 文件存在

部署后确认：
- [ ] 环境变量已配置（JWT_SECRET, CLIENT_ORIGIN, NODE_ENV）
- [ ] 前端页面可以访问
- [ ] 可以注册新用户
- [ ] 可以登录
- [ ] 可以开始游戏

---

## 🎓 下一步

- 📖 阅读完整部署文档：[DEPLOYMENT.md](./DEPLOYMENT.md)
- 🔒 配置自定义域名
- 📊 启用 Vercel Analytics
- 🗄️ 迁移到 PostgreSQL（持久化数据）

---

## 💡 提示

**免费额度：**
- Vercel 免费版每月 100GB 带宽
- 100GB-hr Serverless Function 执行时间
- 足够个人项目使用

**性能优化：**
- Vercel 自动提供全球 CDN
- 自动 HTTPS
- 自动代码分割和优化

**自动部署：**
- 每次推送到 GitHub 都会自动部署
- main 分支 → 生产环境
- 其他分支 → 预览环境

---

**遇到问题？** 查看 [DEPLOYMENT.md](./DEPLOYMENT.md) 或提交 GitHub Issue。

祝部署顺利！🚀

