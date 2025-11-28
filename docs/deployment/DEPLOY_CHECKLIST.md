# ✅ 部署准备清单

## 📋 使用说明
在部署前，逐项检查以下内容。确保所有项目都打勾后再开始部署。

---

## 🔧 本地准备

### 代码检查
- [ ] 所有代码已提交到 Git
- [ ] 没有未保存的更改
- [ ] 运行 `npm run check-deploy` 通过
- [ ] 本地开发服务器运行正常（`npm run dev`）

### 构建测试
- [ ] 前端构建成功：`npm run build -w web`
- [ ] 后端构建成功：`npm run build -w server`
- [ ] 没有 TypeScript 错误
- [ ] 没有 ESLint 错误

### 文件确认
- [ ] `vercel.json` 文件存在
- [ ] `api/index.ts` 文件存在
- [ ] `.vercelignore` 文件存在
- [ ] `env.example` 文件存在
- [ ] `.gitignore` 配置正确

---

## 🌐 GitHub 准备

### 仓库设置
- [ ] 代码已推送到 GitHub
- [ ] 仓库是 public 或有 Vercel 权限
- [ ] 主分支名称正确（main 或 master）
- [ ] README.md 已更新

### 分支管理
- [ ] 在正确的分支上（通常是 main）
- [ ] 所有更改已合并
- [ ] 没有未解决的冲突

---

## 🚀 Vercel 准备

### 账号设置
- [ ] 已注册 Vercel 账号
- [ ] 已连接 GitHub 账号
- [ ] 已授权访问仓库

### 环境变量准备
准备以下环境变量的值：

- [ ] `JWT_SECRET`
  ```bash
  # 生成命令
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
  值：`_____________________________`

- [ ] `CLIENT_ORIGIN`
  - 首次部署：留空或填 `*`
  - 重新部署：填实际域名（如 `https://your-app.vercel.app`）
  值：`_____________________________`

- [ ] `NODE_ENV`
  值：`production`

---

## 📝 部署步骤

### 第一步：导入项目
- [ ] 访问 https://vercel.com
- [ ] 点击 "Add New Project"
- [ ] 选择 GitHub 仓库
- [ ] 点击 "Import"

### 第二步：配置项目
- [ ] Framework Preset: Other
- [ ] Root Directory: `./`
- [ ] Build Command: `npm run vercel-build`
- [ ] Output Directory: `web/dist`
- [ ] Install Command: `npm install`

### 第三步：环境变量
- [ ] 添加 `JWT_SECRET`
- [ ] 添加 `CLIENT_ORIGIN`（可选，首次部署）
- [ ] 添加 `NODE_ENV`

### 第四步：部署
- [ ] 点击 "Deploy"
- [ ] 等待 2-3 分钟
- [ ] 查看构建日志（如有错误）

### 第五步：验证
- [ ] 访问部署的域名
- [ ] 前端页面加载正常
- [ ] 可以打开注册页面
- [ ] 可以打开登录页面

### 第六步：更新环境变量（如需要）
- [ ] 复制 Vercel 域名
- [ ] 更新 `CLIENT_ORIGIN` 为实际域名
- [ ] 重新部署（Deployments → Redeploy）

---

## 🧪 功能测试

### 前端测试
- [ ] 页面样式正常
- [ ] 没有 404 错误
- [ ] 没有控制台错误
- [ ] 响应式布局正常

### 后端测试
- [ ] 健康检查接口：`/api/health`
- [ ] 注册功能正常
- [ ] 登录功能正常
- [ ] 可以获取用户信息

### 游戏功能
- [ ] 可以开始新游戏
- [ ] 可以输入数字
- [ ] 可以完成游戏
- [ ] 可以查看历史记录
- [ ] 可以查看排行榜

---

## 🐛 问题排查

### 如果部署失败

#### 检查构建日志
- [ ] 打开 Vercel Dashboard
- [ ] 进入失败的部署
- [ ] 查看 "Build Logs"
- [ ] 记录错误信息

#### 常见错误
- [ ] TypeScript 错误 → 修复代码
- [ ] 依赖安装失败 → 检查 package.json
- [ ] 构建命令错误 → 检查 vercel.json

### 如果部署成功但无法使用

#### 前端问题
- [ ] 打开浏览器开发者工具（F12）
- [ ] 查看 Console 标签
- [ ] 查看 Network 标签
- [ ] 检查是否有 API 错误

#### 后端问题
- [ ] 检查环境变量是否配置
- [ ] 检查 API 路由是否正确
- [ ] 查看 Vercel Function Logs

#### CORS 问题
- [ ] 确认 `CLIENT_ORIGIN` 正确
- [ ] 检查是否有跨域错误
- [ ] 重新部署

---

## 📊 性能检查

### 加载速度
- [ ] 首页加载 < 3 秒
- [ ] API 响应 < 1 秒
- [ ] 没有明显卡顿

### 资源优化
- [ ] 图片已压缩
- [ ] CSS/JS 已压缩
- [ ] 启用了 CDN

---

## 🔒 安全检查

### 密钥安全
- [ ] `JWT_SECRET` 使用强密码（至少 32 字符）
- [ ] 没有在代码中硬编码密钥
- [ ] `.env` 文件已加入 `.gitignore`

### HTTPS
- [ ] 网站使用 HTTPS（Vercel 自动提供）
- [ ] Cookie 设置了 `secure` 标志
- [ ] 没有混合内容警告

---

## 📈 后续优化

### 短期（1周）
- [ ] 配置自定义域名
- [ ] 添加错误监控（Sentry）
- [ ] 启用 Vercel Analytics

### 中期（1个月）
- [ ] 迁移到 PostgreSQL
- [ ] 添加数据备份
- [ ] 性能优化

### 长期（3个月）
- [ ] PWA 支持
- [ ] 多语言支持
- [ ] 社交分享功能

---

## 📚 参考文档

- [ ] 已阅读 [START_HERE.md](./START_HERE.md)
- [ ] 已阅读 [QUICK_DEPLOY.md](./QUICK_DEPLOY.md)
- [ ] 已阅读 [DEPLOYMENT.md](./DEPLOYMENT.md)
- [ ] 已阅读 [FIXES_SUMMARY.md](./FIXES_SUMMARY.md)

---

## ✅ 最终确认

### 部署前
- [ ] 所有上述检查项已完成
- [ ] 已备份重要数据
- [ ] 已通知相关人员

### 部署后
- [ ] 部署成功
- [ ] 所有功能正常
- [ ] 已记录部署信息
- [ ] 已更新文档

---

## 🎉 部署成功！

如果所有检查项都已完成，恭喜你！

**下一步：**
1. 分享你的应用链接
2. 收集用户反馈
3. 持续优化改进

**部署信息记录：**
```
部署日期：_______________
Vercel 域名：_______________
自定义域名：_______________
部署人员：_______________
```

---

**需要帮助？** 查看 [DEPLOYMENT.md](./DEPLOYMENT.md) 或提交 GitHub Issue。

祝你部署顺利！🚀

