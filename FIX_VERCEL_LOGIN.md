# 🔧 修复 Vercel 生产环境登录问题

## 问题描述

在生产环境 `https://shudu-eosin.vercel.app/` 无法正常登录，控制台显示 404 错误：
- `/api/auth/me` - 404
- `/api/auth/login` - 404
- `/api/auth/register` - 404

## 根本原因

前端代码在 Vercel 部署时，API 请求仍然发送到 Vercel 域名，而不是 Railway 后端。

## 解决方案

### 方法 1：在 Vercel 中设置环境变量（推荐）

1. **登录 Vercel Dashboard**
   - 访问 https://vercel.com/dashboard
   - 选择项目 `shudu-eosin`

2. **进入项目设置**
   - 点击项目名称
   - 左侧菜单选择 **Settings**
   - 选择 **Environment Variables**

3. **添加环境变量**
   - 点击 **Add New**
   - **Key**: `VITE_API_URL`
   - **Value**: `https://shudu-production.up.railway.app`
   - **Environment**: 选择 `Production`、`Preview`、`Development`（全选）
   - 点击 **Save**

4. **重新部署**
   - 进入 **Deployments** 标签
   - 找到最新的部署
   - 点击右侧 **⋯** 菜单
   - 选择 **Redeploy**
   - 确认重新部署

5. **等待部署完成**（约 1-2 分钟）

6. **验证修复**
   - 访问 https://shudu-eosin.vercel.app
   - 打开浏览器控制台（F12）
   - 查看 `🔧 API Request:` 日志
   - 确认 `apiBase` 为 `https://shudu-production.up.railway.app`
   - 尝试登录/注册

### 方法 2：代码已自动修复（备用方案）

如果方法 1 不生效，代码已经更新为自动检测 Vercel 域名并指向 Railway 后端。

**代码逻辑：**
1. 优先使用环境变量 `VITE_API_URL`
2. 如果未设置，自动检测域名：
   - `localhost` → 使用本地代理
   - `*.vercel.app` → 自动使用 Railway 后端
   - 其他域名 → 使用 Railway 后端

**验证步骤：**
1. 推送代码到 GitHub：
   ```bash
   git add .
   git commit -m "🔧 修复生产环境 API 配置"
   git push origin main
   ```

2. Vercel 会自动重新部署

3. 等待部署完成后测试

## 验证清单

- [ ] Vercel 环境变量 `VITE_API_URL` 已设置
- [ ] 环境变量值正确：`https://shudu-production.up.railway.app`
- [ ] 已重新部署
- [ ] 浏览器控制台显示正确的 `apiBase`
- [ ] 登录功能正常
- [ ] 注册功能正常

## 调试信息

打开浏览器控制台，查看 `🔧 API Request:` 日志：

```javascript
{
  apiBase: "https://shudu-production.up.railway.app",  // ✅ 应该是这个
  url: "https://shudu-production.up.railway.app/api/auth/me",
  hostname: "shudu-eosin.vercel.app",
  VITE_API_URL: "https://shudu-production.up.railway.app",  // ✅ 应该设置
  MODE: "production",
  PROD: true
}
```

如果 `apiBase` 为空字符串或显示 Vercel 域名，说明配置未生效。

## 常见问题

### Q: 设置了环境变量但仍然是 404？

**A:** 检查以下几点：
1. 环境变量是否选择了正确的环境（Production）
2. 是否重新部署了项目
3. 浏览器是否清除了缓存（Ctrl+Shift+R 强制刷新）

### Q: 控制台显示 `VITE_API_URL: "not set"`？

**A:** 说明环境变量未正确设置：
1. 确认在 Vercel Dashboard 中已添加
2. 确认变量名是 `VITE_API_URL`（注意大小写）
3. 确认已重新部署

### Q: 本地开发正常，但生产环境不行？

**A:** 这是正常的，因为：
- 本地使用 Vite proxy（`vite.config.ts`）
- 生产环境需要环境变量或自动检测

## 相关文件

- `web/src/services/api.ts` - API 配置逻辑
- `vercel.json` - Vercel 部署配置
- `docs/deployment/VERCEL_GUIDE.md` - Vercel 部署指南

