# 🚂 Railway 配置详细步骤

> 你的 Railway 项目：https://railway.com/project/7396fded-b5c3-4131-aa33-b239e68a85df

---

## 📋 需要完成的配置

### ✅ 第 1 步：添加环境变量（5分钟）

#### 1.1 进入项目
- 打开你的 Railway 项目页面
- 你应该能看到一个服务卡片（可能显示为 "Shudu" 或 "server"）

#### 1.2 点击服务
- 点击服务卡片进入详情页

#### 1.3 进入 Variables 标签
- 在顶部导航栏找到并点击 **"Variables"** 标签
- 你会看到一个添加变量的界面

#### 1.4 添加第一个变量
点击 **"New Variable"** 或 **"Add Variable"** 按钮

**变量 1：环境标识**
```
Variable Name: NODE_ENV
Variable Value: production
```
点击 **"Add"** 或按回车确认

#### 1.5 添加第二个变量
再次点击 **"New Variable"**

**变量 2：JWT 密钥**
```
Variable Name: JWT_SECRET
Variable Value: 94f7beaeab52119bb20da942bbde5df32b270baf08f93efb5b5d3234c272e8ea
```
点击 **"Add"** 或按回车确认

⚠️ **重要**：这个密钥很长，确保完整复制，不要有空格或换行

#### 1.6 添加第三个变量
再次点击 **"New Variable"**

**变量 3：前端地址**
```
Variable Name: CLIENT_ORIGIN
Variable Value: https://shudu-eosin.vercel.app
```
点击 **"Add"** 或按回车确认

#### 1.7 确认变量
你应该能看到 3 个变量：
- ✅ NODE_ENV = production
- ✅ JWT_SECRET = 94f7b...
- ✅ CLIENT_ORIGIN = https://shudu-eosin.vercel.app

---

### ✅ 第 2 步：生成公开域名（2分钟）

#### 2.1 进入 Settings
- 点击顶部的 **"Settings"** 标签

#### 2.2 找到 Networking/Domains 部分
- 向下滚动页面
- 找到 **"Networking"** 或 **"Domains"** 部分

#### 2.3 生成域名
如果还没有域名：
- 点击 **"Generate Domain"** 按钮
- Railway 会自动生成一个公开域名

#### 2.4 复制域名
- 域名格式类似：`shudu-production-xxxx.up.railway.app`
- 点击域名旁边的 📋 复制按钮
- 或者手动选中并复制

#### 2.5 测试后端
在浏览器打开（替换成你的域名）：
```
https://你的域名.up.railway.app/api/health
```

**应该看到：**
```json
{"status":"ok","time":"2025-11-28T..."}
```

✅ 如果看到这个，说明后端部署成功！

---

### ✅ 第 3 步：等待部署完成（1-2分钟）

#### 3.1 查看部署状态
- 点击 **"Deployments"** 标签
- 查看最新的部署状态

#### 3.2 等待成功
- 状态应该从 "Building" → "Deploying" → "Success"
- 如果失败，查看日志找原因

---

## 📝 配置完成后

### 把你的 Railway 域名告诉我

复制你的 Railway 域名（类似这样）：
```
https://shudu-production-xxxx.up.railway.app
```

然后告诉我这个域名，我会帮你：
1. 自动配置前端连接
2. 推送更新到 GitHub
3. 等待 Vercel 重新部署
4. 测试完整功能

---

## 🎯 快速复制区

### 环境变量（直接复制使用）

**变量 1：**
```
NODE_ENV
production
```

**变量 2：**
```
JWT_SECRET
94f7beaeab52119bb20da942bbde5df32b270baf08f93efb5b5d3234c272e8ea
```

**变量 3：**
```
CLIENT_ORIGIN
https://shudu-eosin.vercel.app
```

---

## 🐛 常见问题

### Q: 找不到 "Variables" 标签？
**A:** 确保你点击了服务卡片进入详情页，Variables 在顶部导航栏

### Q: 找不到 "Generate Domain" 按钮？
**A:** 在 Settings → Networking 部分，可能已经自动生成了域名

### Q: 部署失败怎么办？
**A:** 
1. 点击 Deployments 查看日志
2. 检查环境变量是否正确
3. 确认 railway.json 文件存在

### Q: 如何查看日志？
**A:** Deployments → 点击最新部署 → View Logs

---

## 📸 界面位置参考

```
Railway 项目页面
│
├── 服务卡片（点击进入）
│   │
│   ├── 顶部导航栏
│   │   ├── Deployments  ← 查看部署状态
│   │   ├── Variables    ← 在这里添加环境变量 ⚙️
│   │   ├── Settings     ← 在这里生成域名 🌐
│   │   └── Logs
│   │
│   └── 主内容区
│       ├── 部署信息
│       └── 资源使用情况
│
└── 左侧边栏
    ├── Overview
    └── Settings
```

---

## ✨ 下一步

完成上述配置后，把你的 Railway 域名发给我，格式类似：

```
https://shudu-production-xxxx.up.railway.app
```

我会立即帮你完成剩余的配置！🚀

---

**需要帮助？** 随时告诉我你在哪一步遇到问题！

