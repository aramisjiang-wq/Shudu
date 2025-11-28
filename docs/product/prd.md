# Sudoku Arena PRD

> Last updated: 2025-11-28T14:00:00Z
> Source of truth for产品视角需求，所有设计/开发以本文为准。
> **部署状态：** ✅ 已上线 - [在线体验](https://shudu-eosin.vercel.app)

## 1. 背景 & 目标
- 让用户在浏览器中进行标准 9x9 数独对战，强调“学习-挑战-复盘”闭环，并赋予「数独的孤独世界（快来play我）」主题感。
- 用户需可注册、登录并持久化历史战绩，便于复盘与排行榜扩展。
- 体验需贴合真实数独习惯：同行列高亮、同值聚焦、草稿笔记、数字余量提示。

**成功指标（MVP）**
1. 用户可完成注册/登录/登出，并在 30 秒内取到首局题目。
2. 填写一局后战绩写入历史列表，刷新页面仍能看到同样数据。
3. 至少 80% 的核心交互符合传统数独玩法（高亮、笔记、键盘输入）。

## 2. 用户画像 & 场景
| 角色 | 场景 | 需求 |
| --- | --- | --- |
| 休闲玩家 | 午休快速来一局 | 秒级开局、自动计时、可暂停 |
| 进阶玩家 | 想要记录成绩 | 多难度、错误统计、历史列表 |
| 社区贡献者 / AI Agent | 扩展玩法或脚本 | 清晰 API、文档齐全、可复用的交互约束 |

## 3. 功能范围
### 3.1 Must Have
- 账户体系：注册、登录、登出、`/api/auth/me`。
- 数独玩法：easy/medium/hard 难度生成、唯一解校验、键盘与鼠标双输入，且差异化体现在挖空数量与失误上限（新手 8、进阶 5、专家 3）。
- 交互增强：同行列/宫高亮、相同数字联动、草稿模式（按钮+快捷键）、数字余量提示、九宫格粗线、错误计数。
- 战绩面板：历史列表（难度、用时、错误、完成时间），完成即写入。
- 排行榜面板：按难度展示 Top10（按用时升序、错误少优先），游客可浏览，玩家可冲榜。
- 情绪反馈：失败触发鼓励动画与“孤独世界抱抱”文案，胜利触发“王子抱公主”正反馈，可一键再战/冲榜。
- 安全：密码哈希、JWT Cookie、受保护 API。

### 3.2 Nice to Have（后续迭代）
- 排行榜分享链接 / 战绩分享海报。
- 历史详情（回放最后棋盘）。
- 多设备同步提醒 & 推送。

### 3.3 Out of Scope
- 多人实时对战。
- 社交登录、邮箱验证。
- 移动原生 App。

## 4. 用户旅程
1. 打开页面 → 自动检测会话 → 未登录则展示 AuthPanel。
2. 登录/注册成功 → 自动刷新历史 + 请求新题 → 进入游戏主面板。
3. 通过键盘/鼠标填写，必要时切换草稿模式；冲突即时高亮。
4. 完成棋盘 → 自动提交战绩 → 历史面板最上方出现最新记录。
5. 可切换难度或重新生成 → 循环。

## 5. 详细需求
- **同行列/宫高亮**：点击任意格后，其行/列/宫背景淡绿色；同数值（非 0）背景淡黄色；九宫格边界加粗便于分区。
- **草稿模式**：
  - 按钮或 `N`/`Shift+数字` 切换，空格可写 1~9 小数字九宫格。
  - 输入最终答案会清除该格所有草稿。
- **数字余量**：数字面板展示“数值 / 剩余次数”，仅当剩余 >0 或在草稿模式下才可点击。
- **错误上限**：按难度设置（新手 8、进阶 5、专家 3）；超过阈值自动暂停并展示鼓励 Overlay。
- **胜利反馈**：通关后弹出庆祝 Overlay（王子抱公主），展示用时/难度并引导玩家查看排行榜或立即再战。
- **键盘**：方向键移动；Backspace/Delete/0 清空；Shift+数字写草稿；`N` 切换草稿模式。
- **状态提示**：计时器、错误次数、难度描述、生成/保存中的 Loading Tag。
- **排行榜面板**：展示所选难度 Top10（用时升序、错误少优先），字段含玩家昵称、用时（mm:ss）、错误次数、完成时间；可点击某条作为挑战目标（提示语，不自动加载题目）。

### 5.2 数据
- `users` 表：邮箱、昵称、哈希密码、创建时间。
- `game_history` 表：用户 ID、难度、用时、错误、完成时间、题目/解种子、落子快照。

### 5.3 API 契约
- 详见 `docs/architecture.md` 第 3 章，遵循统一错误格式 `{ error: { code, message } }`。
- 排行榜接口：
  - `GET /api/leaderboard?difficulty=easy` → `{ items: LeaderboardEntry[] }`
  - `LeaderboardEntry = { displayName: string; durationSeconds: number; mistakes: number; completedAt: string }`

### 5.4 非功能需求
- 性能：生成题目 < 100ms；API < 200ms；前端首帧 < 2s（本地环境）。
- 安全：JWT 存于 HttpOnly Cookie，`SameSite=Strict`，生产需 `Secure=true`。
- 可维护性：TypeScript 全覆盖，文档优先原则（变更先改文档）。

## 6. 依赖 & 风险
- Node.js LTS (20.x) + SQLite；`better-sqlite3` 在较新 Node 版本需编译参数或 LTS。
- 自签证书环境需设置 `cafile` 或暂时 `NODE_TLS_REJECT_UNAUTHORIZED=0` 才能装依赖。
- 若未来接入 AI 代理，需要额外的操作日志与脚本化接口（未包含在 MVP）。

## 7. 里程碑
1. **v1.0 (2025-11-26)** ✅：注册/登录/游玩/战绩闭环 + 数独交互增强。
2. **v1.0.1 (2025-11-28)** ✅：排行榜功能上线 + 全栈部署完成。
   - 前端：Vercel (https://shudu-eosin.vercel.app)
   - 后端：Railway (https://shudu-production.up.railway.app)
   - 数据库：SQLite on Railway
3. **v1.1 (待定)**：战绩详情、数据库迁移到 PostgreSQL。
4. **v2.0 (待定)**：多人对战、AI 助手提示。

## 8. 部署架构

### 8.1 生产环境
- **前端托管**：Vercel
  - 自动 HTTPS
  - 全球 CDN
  - GitHub 自动部署
- **后端托管**：Railway
  - Node.js 运行时
  - SQLite 持久化
  - 自动扩容
- **CI/CD**：推送到 main 分支自动触发部署

### 8.2 访问地址
- **用户入口**：https://shudu-eosin.vercel.app
- **API 端点**：https://shudu-production.up.railway.app
- **健康检查**：https://shudu-production.up.railway.app/health

### 8.3 环境变量
**前端（Vercel）：**
```
VITE_API_URL=https://shudu-production.up.railway.app
```

**后端（Railway）：**
```
NODE_ENV=production
JWT_SECRET=<随机生成>
CLIENT_ORIGIN=https://shudu-eosin.vercel.app
PORT=8080
```

---
任何偏离本文的需求变更需先更新本 PRD，并在 README / Architecture 同步时间戳。

**部署文档：** 详见 [docs/deployment/](../deployment/) 目录

