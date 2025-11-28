# 🎮 数独游戏 - 全栈 Web 应用

> 一个功能完整的在线数独游戏，支持用户系统、游戏历史和排行榜

[![部署状态](https://img.shields.io/badge/部署-成功-success)](https://shudu-eosin.vercel.app)
[![前端](https://img.shields.io/badge/前端-Vercel-black)](https://shudu-eosin.vercel.app)
[![后端](https://img.shields.io/badge/后端-Railway-purple)](https://shudu-production.up.railway.app)

---

## 🌐 在线体验

**前端应用：** https://shudu-eosin.vercel.app  
**后端 API：** https://shudu-production.up.railway.app

---

## ✨ 功能特性

### 🎯 核心功能
- **数独游戏**：三种难度（简单、中等、困难）
- **用户系统**：注册、登录、JWT 认证
- **游戏历史**：保存和查看历史记录
- **排行榜**：展示最快完成时间

### 🎨 用户体验
- 响应式设计，支持移动端
- 实时游戏状态保存
- 错误提示和验证
- 流畅的动画效果

### 🔒 安全特性
- JWT Token 认证
- 密码加密存储（bcrypt）
- CORS 跨域保护
- Cookie 安全配置

---

## 🛠️ 技术栈

### 前端
- **框架**：React 18 + TypeScript
- **构建工具**：Vite
- **样式**：CSS Modules
- **状态管理**：React Hooks
- **路由**：React Router（客户端路由）

### 后端
- **运行时**：Node.js
- **框架**：Express
- **语言**：TypeScript
- **数据库**：SQLite (better-sqlite3)
- **认证**：JWT + bcrypt
- **验证**：Zod

### 部署
- **前端托管**：Vercel
- **后端托管**：Railway
- **CI/CD**：GitHub 自动部署

---

## 📁 项目结构

```
shudu/
├── web/                    # 前端应用
│   ├── src/
│   │   ├── components/     # React 组件
│   │   ├── pages/          # 页面组件
│   │   ├── services/       # API 服务
│   │   ├── types/          # TypeScript 类型
│   │   └── App.tsx         # 根组件
│   ├── package.json
│   └── vite.config.ts
│
├── server/                 # 后端 API
│   ├── src/
│   │   ├── routes/         # API 路由
│   │   ├── db.ts           # 数据库配置
│   │   ├── config.ts       # 应用配置
│   │   └── app.ts          # Express 应用
│   ├── package.json
│   └── tsconfig.json
│
├── docs/                   # 文档
│   ├── deployment/         # 部署文档
│   ├── guides/             # 开发指南
│   └── product/            # 产品文档
│
├── package.json            # Workspace 配置
├── vercel.json             # Vercel 配置
└── README.md               # 项目说明
```

---

## 🚀 快速开始

### 前置条件

- Node.js 18+
- npm 9+

### 本地开发

1. **克隆仓库**
   ```bash
   git clone https://github.com/aramisjiang-wq/Shudu.git
   cd Shudu
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   ```

4. **访问应用**
   - 前端：http://localhost:5173
   - 后端：http://localhost:8080

### 构建生产版本

```bash
# 构建前端和后端
npm run build

# 仅构建前端
npm run build -w web

# 仅构建后端
npm run build -w server
```

---

## 📚 文档

### 快速导航

- **[开始使用](./START_HERE.md)** - 项目入门指南
- **[项目结构](./PROJECT_STRUCTURE.md)** - 详细的目录结构说明
- **[部署复盘](./docs/deployment/FULL_STACK_DEPLOYMENT_REVIEW.md)** - 完整的部署过程记录

### 部署文档

- **[Railway 部署指南](./docs/deployment/RAILWAY_GUIDE.md)** - 后端部署详细步骤
- **[Vercel 部署指南](./docs/deployment/VERCEL_GUIDE.md)** - 前端部署详细步骤
- **[部署检查清单](./DEPLOYMENT_CHECKLIST_RAILWAY.md)** - 部署前的检查事项

### 开发文档

- **[开发指南](./docs/guides/DEVELOPMENT_GUIDE.md)** - 开发规范和最佳实践
- **[故障排查](./docs/guides/TROUBLESHOOTING.md)** - 常见问题解决方案

### 产品文档

- **[PRD](./docs/product/PRD.md)** - 产品需求文档
- **[技术规格](./docs/product/SPEC.md)** - 技术实现规格

---

## 🔧 配置说明

### 环境变量

#### 前端 (`web/.env.production`)
```bash
VITE_API_URL=https://shudu-production.up.railway.app
```

#### 后端 (Railway 环境变量)
```bash
NODE_ENV=production
JWT_SECRET=<随机生成的密钥>
CLIENT_ORIGIN=https://shudu-eosin.vercel.app
PORT=8080  # Railway 自动设置
```

### 生成 JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 📊 API 文档

### 认证接口

```typescript
POST /api/auth/register    # 用户注册
POST /api/auth/login       # 用户登录
POST /api/auth/logout      # 用户登出
GET  /api/auth/me          # 获取当前用户
```

### 游戏接口

```typescript
POST /api/puzzle/generate  # 生成新游戏
POST /api/puzzle/validate  # 验证答案
```

### 历史记录

```typescript
GET  /api/games/history    # 获取游戏历史
POST /api/games/history    # 保存游戏记录
```

### 排行榜

```typescript
GET  /api/leaderboard      # 获取排行榜
```

### 健康检查

```typescript
GET  /health               # 服务健康检查
```

---

## 🧪 测试

```bash
# 运行测试（待实现）
npm test

# 类型检查
npm run lint -w web
npm run lint -w server
```

---

## 📈 性能指标

| 指标 | 数值 |
|------|------|
| 首次加载时间 | < 2 秒 |
| API 响应时间 | < 200ms |
| 前端构建时间 | ~30 秒 |
| 后端构建时间 | ~2 分钟 |
| Lighthouse 分数 | 90+ |

---

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

---

## 📝 开发日志

### v1.0.0 (2025-11-28)

**✨ 新功能**
- 完整的数独游戏功能
- 用户注册和登录系统
- 游戏历史记录
- 排行榜功能

**🚀 部署**
- 前端部署到 Vercel
- 后端部署到 Railway
- 实现 CI/CD 自动部署

**📚 文档**
- 完整的部署文档
- 开发指南
- API 文档

---

## 🐛 已知问题

- [ ] SQLite 数据在 Railway 重新部署后会丢失（需要配置 Volume 或迁移到 PostgreSQL）
- [ ] 移动端键盘输入体验待优化
- [ ] 缺少单元测试和集成测试

---

## 🗺️ 路线图

### v1.1.0
- [ ] 添加游戏提示功能
- [ ] 实现游戏暂停/继续
- [ ] 添加音效和动画

### v1.2.0
- [ ] 迁移到 PostgreSQL
- [ ] 添加社交分享功能
- [ ] 实现多人对战模式

### v2.0.0
- [ ] 移动端 App（React Native）
- [ ] 实时对战功能
- [ ] AI 对手

---

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

---

## 👥 作者

**Dong** - [GitHub](https://github.com/aramisjiang-wq)

---

## 🙏 致谢

- 感谢 [Vercel](https://vercel.com) 提供免费的前端托管
- 感谢 [Railway](https://railway.app) 提供免费的后端托管
- 感谢所有开源项目的贡献者

---

## 📞 联系方式

- **项目地址**：https://github.com/aramisjiang-wq/Shudu
- **在线演示**：https://shudu-eosin.vercel.app
- **问题反馈**：[Issues](https://github.com/aramisjiang-wq/Shudu/issues)

---

<div align="center">

**⭐ 如果这个项目对你有帮助，请给一个 Star！⭐**

Made with ❤️ by Dong

</div>
