# 🔧 问题排查手册

> 常见问题的诊断和解决方案

---

## 📋 目录

1. [开发环境问题](#开发环境问题)
2. [构建问题](#构建问题)
3. [部署问题](#部署问题)
4. [运行时问题](#运行时问题)
5. [数据库问题](#数据库问题)
6. [认证问题](#认证问题)
7. [性能问题](#性能问题)

---

## 开发环境问题

### 问题 1：npm install 失败

**症状：**
```bash
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**原因：**
- 依赖版本冲突
- npm 版本过旧
- 网络问题

**解决方案：**
```bash
# 方案 1：清理缓存
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# 方案 2：使用 --legacy-peer-deps
npm install --legacy-peer-deps

# 方案 3：更新 npm
npm install -g npm@latest

# 方案 4：使用国内镜像
npm config set registry https://registry.npmmirror.com
```

### 问题 2：端口被占用

**症状：**
```
Error: listen EADDRINUSE: address already in use :::5173
Error: listen EADDRINUSE: address already in use :::8080
```

**原因：**
- 端口已被其他进程占用
- 上次开发服务器未正常关闭

**解决方案：**
```bash
# macOS/Linux
# 查找占用端口的进程
lsof -ti:5173
lsof -ti:8080

# 杀死进程
kill -9 $(lsof -ti:5173)
kill -9 $(lsof -ti:8080)

# Windows
# 查找占用端口的进程
netstat -ano | findstr :5173
netstat -ano | findstr :8080

# 杀死进程（PID 是上面命令的最后一列）
taskkill /PID <PID> /F
```

### 问题 3：TypeScript 类型错误

**症状：**
```
Type 'string | undefined' is not assignable to type 'string'
Property 'xxx' does not exist on type 'YYY'
```

**原因：**
- 类型定义不准确
- 缺少类型声明
- 严格模式检查

**解决方案：**
```typescript
// 方案 1：使用类型断言
const value = process.env.API_URL as string;

// 方案 2：使用可选链和空值合并
const value = process.env.API_URL ?? 'default';

// 方案 3：类型守卫
if (typeof value === 'string') {
  // value 在这里是 string 类型
}

// 方案 4：添加类型声明
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}
```

---

## 构建问题

### 问题 4：Vite 构建失败

**症状：**
```
[vite]: Rollup failed to resolve import "xxx" from "yyy"
Transform failed with 1 error
```

**原因：**
- 模块路径错误
- 缺少依赖
- 配置错误

**解决方案：**
```bash
# 1. 检查依赖是否安装
npm list <package-name>

# 2. 重新安装依赖
npm install

# 3. 检查 vite.config.ts
# 确保 resolve.alias 配置正确

# 4. 清理构建缓存
rm -rf node_modules/.vite
rm -rf dist
npm run build
```

### 问题 5：TypeScript 编译错误

**症状：**
```
error TS2307: Cannot find module 'xxx' or its corresponding type declarations
error TS2322: Type 'X' is not assignable to type 'Y'
```

**原因：**
- 缺少类型声明
- tsconfig.json 配置错误
- 类型不匹配

**解决方案：**
```bash
# 1. 安装类型声明
npm install -D @types/<package-name>

# 2. 检查 tsconfig.json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "esModuleInterop": true,
    "skipLibCheck": true  // 跳过库文件检查
  }
}

# 3. 清理并重新构建
rm -rf dist
npm run build
```

---

## 部署问题

### 问题 6：Vercel 部署失败

**症状：**
```
Error: Command "npm run build" exited with 1
Build failed
```

**原因：**
- 构建命令错误
- 环境变量缺失
- 依赖安装失败

**解决方案：**
```bash
# 1. 本地测试构建
npm run build

# 2. 检查 package.json
{
  "scripts": {
    "vercel-build": "npm run build -w web"
  }
}

# 3. 检查 vercel.json
{
  "builds": [
    {
      "src": "web/package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "web/dist" }
    }
  ]
}

# 4. 查看 Vercel 构建日志
# Dashboard → Deployments → 失败的部署 → View Function Logs
```

### 问题 7：API 路由 404

**症状：**
```
GET /api/auth/me 404 (Not Found)
Failed to fetch
```

**原因：**
- API 路由配置错误
- Serverless Function 未正确部署
- 路径不匹配

**解决方案：**
```json
// 1. 检查 vercel.json 路由配置
{
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/index.ts"
    }
  ]
}

// 2. 确保 api/index.ts 存在并导出 app
export default app;

// 3. 检查前端 API 调用路径
// 使用相对路径
fetch('/api/auth/me', { ... });

// 4. 查看 Vercel Function Logs
// Dashboard → Project → Functions → Logs
```

### 问题 8：CORS 错误

**症状：**
```
Access to fetch at 'xxx' from origin 'yyy' has been blocked by CORS policy
No 'Access-Control-Allow-Origin' header is present
```

**原因：**
- CORS 未配置
- CLIENT_ORIGIN 配置错误
- credentials 设置不匹配

**解决方案：**
```typescript
// 1. 后端配置 CORS
import cors from 'cors';

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true,  // 允许携带 Cookie
}));

// 2. 前端请求配置
fetch('/api/xxx', {
  credentials: 'include',  // 携带 Cookie
});

// 3. 检查环境变量
// Vercel Dashboard → Settings → Environment Variables
// CLIENT_ORIGIN = https://your-app.vercel.app

// 4. 重新部署
```

### 问题 9：环境变量未生效

**症状：**
```
JWT_SECRET is undefined
Database connection failed
```

**原因：**
- 环境变量未设置
- 变量名错误
- 未重新部署

**解决方案：**
```bash
# 1. 在 Vercel Dashboard 设置环境变量
Settings → Environment Variables → Add

# 必需的环境变量：
JWT_SECRET=your-secret-key-here
CLIENT_ORIGIN=https://your-app.vercel.app
NODE_ENV=production

# 2. 重新部署
Deployments → Latest → Redeploy

# 3. 检查环境变量是否正确
# 在 Function Logs 中查看
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');
```

---

## 运行时问题

### 问题 10：登录后刷新页面丢失状态

**症状：**
- 登录成功后刷新页面
- 用户状态丢失，需要重新登录

**原因：**
- Cookie 未正确设置
- Cookie 过期
- SameSite 属性问题

**解决方案：**
```typescript
// 1. 后端设置 Cookie
res.cookie('token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',  // HTTPS
  sameSite: 'lax',  // 或 'strict'
  maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 天
});

// 2. 前端检查 Cookie
// 打开浏览器开发者工具
// Application → Cookies → 检查是否有 token

// 3. 前端请求携带 Cookie
fetch('/api/auth/me', {
  credentials: 'include',
});

// 4. 检查 CORS 配置
app.use(cors({
  origin: process.env.CLIENT_ORIGIN,
  credentials: true,  // 必须设置
}));
```

### 问题 11：API 响应慢

**症状：**
- API 请求需要 3-5 秒
- 页面加载缓慢

**原因：**
- 数据库查询慢
- 未使用索引
- 冷启动（Serverless）

**解决方案：**
```typescript
// 1. 添加数据库索引
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_game_user_id ON game_history(user_id);

// 2. 优化查询
// 避免 SELECT *
SELECT id, email, display_name FROM users WHERE id = ?;

// 3. 使用缓存
const cache = new Map();
const getCachedData = (key) => {
  if (!cache.has(key)) {
    cache.set(key, fetchData(key));
  }
  return cache.get(key);
};

// 4. Serverless 冷启动优化
// 使用 Vercel Edge Functions（更快）
// 或保持 Function 温暖（定期请求）
```

### 问题 12：前端白屏

**症状：**
- 页面加载后显示白屏
- 控制台有错误

**原因：**
- JavaScript 错误
- 组件渲染失败
- 路由配置错误

**解决方案：**
```typescript
// 1. 检查浏览器控制台
// F12 → Console → 查看错误信息

// 2. 添加错误边界
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Error:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <h1>出错了，请刷新页面</h1>;
    }
    return this.props.children;
  }
}

// 3. 检查路由配置
// 确保所有路由都有对应的组件

// 4. 检查 API 调用
// 确保 API 返回正确的数据格式
```

---

## 数据库问题

### 问题 13：SQLite 数据丢失

**症状：**
- 重启后数据消失
- Vercel 部署后数据重置

**原因：**
- SQLite 文件在 Serverless 环境不持久化
- 每次部署都会重置

**解决方案：**
```typescript
// 方案 1：接受数据丢失（演示项目）
// 适合开发和演示

// 方案 2：迁移到 PostgreSQL
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// 方案 3：使用 Vercel Postgres
import { sql } from '@vercel/postgres';

const result = await sql`SELECT * FROM users WHERE id = ${userId}`;

// 方案 4：使用其他数据库服务
// - Supabase（PostgreSQL）
// - PlanetScale（MySQL）
// - MongoDB Atlas
```

### 问题 14：数据库连接失败

**症状：**
```
Error: connect ECONNREFUSED
Database connection timeout
```

**原因：**
- 数据库未启动
- 连接字符串错误
- 网络问题

**解决方案：**
```bash
# 1. 检查数据库是否运行
# SQLite
ls -la server/data/sudoku.db

# PostgreSQL
pg_isready

# 2. 检查连接字符串
# .env
DATABASE_URL=postgresql://user:password@host:5432/dbname

# 3. 测试连接
node -e "
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.query('SELECT NOW()', (err, res) => {
  console.log(err ? err : res.rows[0]);
  pool.end();
});
"
```

---

## 认证问题

### 问题 15：JWT 验证失败

**症状：**
```
Error: invalid token
Error: jwt expired
Unauthorized
```

**原因：**
- Token 过期
- JWT_SECRET 不匹配
- Token 格式错误

**解决方案：**
```typescript
// 1. 检查 JWT_SECRET
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');

// 2. 检查 Token 过期时间
jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });

// 3. 添加错误处理
try {
  const decoded = jwt.verify(token, JWT_SECRET);
  req.userId = decoded.userId;
  next();
} catch (err) {
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token 已过期' });
  }
  return res.status(401).json({ error: '无效的 Token' });
}

// 4. 前端处理 401 错误
if (res.status === 401) {
  // 清除本地状态
  // 跳转到登录页
}
```

### 问题 16：密码验证失败

**症状：**
```
Login failed: Invalid credentials
bcrypt compare error
```

**原因：**
- 密码加密方式不一致
- 数据库中密码格式错误
- bcrypt 版本问题

**解决方案：**
```typescript
// 1. 确保加密和验证使用相同的库
import bcrypt from 'bcryptjs';

// 注册时加密
const hash = await bcrypt.hash(password, 10);

// 登录时验证
const isValid = await bcrypt.compare(password, hash);

// 2. 检查数据库中的密码
// 应该是 $2a$10$... 格式

// 3. 重置密码测试
// 删除用户，重新注册
```

---

## 性能问题

### 问题 17：页面加载慢

**症状：**
- 首次加载需要 5-10 秒
- 白屏时间长

**原因：**
- 包体积过大
- 未使用代码分割
- 资源未压缩

**解决方案：**
```typescript
// 1. 使用 lazy loading
const HistoryPanel = lazy(() => import('./HistoryPanel'));
const LeaderboardPanel = lazy(() => import('./LeaderboardPanel'));

// 2. 分析包体积
npm run build
# 查看 dist/assets/ 文件大小

// 3. 使用 Vite 分析插件
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: true }),
  ],
});

// 4. 优化依赖
// 移除未使用的依赖
npm uninstall <unused-package>
```

### 问题 18：内存泄漏

**症状：**
- 页面使用一段时间后变慢
- 浏览器内存占用高

**原因：**
- 未清理事件监听器
- 未取消订阅
- 闭包引用

**解决方案：**
```typescript
// 1. 清理 useEffect
useEffect(() => {
  const timer = setInterval(() => {
    // ...
  }, 1000);
  
  return () => clearInterval(timer);  // 清理
}, []);

// 2. 清理事件监听
useEffect(() => {
  const handleResize = () => { /* ... */ };
  window.addEventListener('resize', handleResize);
  
  return () => window.removeEventListener('resize', handleResize);
}, []);

// 3. 使用 React DevTools Profiler
// 查找重渲染问题
```

---

## 调试技巧

### 前端调试

```typescript
// 1. 使用 console.log
console.log('API Response:', data);
console.table(users);  // 表格形式
console.time('fetch');  // 性能测试
// ... code ...
console.timeEnd('fetch');

// 2. 使用 React DevTools
// Chrome 扩展：React Developer Tools
// 查看组件树、Props、State

// 3. 使用 Network 标签
// F12 → Network
// 查看 API 请求和响应

// 4. 使用断点
debugger;  // 代码中设置断点
// 或在浏览器中设置断点
```

### 后端调试

```typescript
// 1. 使用 console.log
console.log('Request:', req.body);
console.log('User ID:', req.userId);

// 2. 使用 VS Code 调试器
// .vscode/launch.json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Server",
  "program": "${workspaceFolder}/server/src/app.ts",
  "runtimeExecutable": "tsx"
}

// 3. 查看 Vercel Logs
// Dashboard → Functions → Logs

// 4. 使用 Postman 测试 API
// 独立测试每个端点
```

---

## 获取帮助

### 检查清单

遇到问题时，按顺序检查：

1. **查看错误信息**
   - 浏览器控制台
   - 终端输出
   - Vercel 日志

2. **搜索文档**
   - 本文档
   - 官方文档
   - Stack Overflow

3. **隔离问题**
   - 最小化复现
   - 排除其他因素
   - 逐步调试

4. **寻求帮助**
   - GitHub Issues
   - 社区论坛
   - AI 助手

### 提问模板

```markdown
## 问题描述
简要描述问题

## 环境信息
- 操作系统：macOS / Windows / Linux
- Node.js 版本：20.19.6
- npm 版本：10.x.x
- 浏览器：Chrome 120

## 复现步骤
1. 第一步
2. 第二步
3. 第三步

## 预期行为
应该发生什么

## 实际行为
实际发生了什么

## 错误信息
```
粘贴完整的错误信息
```

## 已尝试的解决方案
- 尝试了 xxx，结果 xxx
- 尝试了 yyy，结果 yyy
```

---

**文档版本**：v1.0.0  
**最后更新**：2025-11-28

**相关文档：**
- [开发指南](./DEVELOPMENT_GUIDE.md)
- [部署指南](./deployment/DEPLOYMENT.md)

---

祝你顺利解决问题！🔧

