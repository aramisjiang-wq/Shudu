# Sudoku Arena 技术规格（Spec）

> Last updated: 2025-11-26T14:10:00Z
> 说明：本文件从工程角度描述实现细节，配合 `docs/prd.md`、`docs/architecture.md` 使用。

## 1. 系统视图
- **前端 (`web/`)**：Vite + React 18 + TypeScript。状态以 hooks 驱动（`useAuth`, `useTimer`, 局部 state）。与后端通过 `/api/*` 通信，凭证依赖 HttpOnly Cookie。
- **后端 (`server/`)**：Node 20 + Express。SQLite via `better-sqlite3`。JWT 鉴权（7 天）。模块化路由（auth/puzzle/history）。
- **文档**：`README.md` 为入口，`docs/architecture.md` 定义数据 & API，本文件补充实现规范。

## 2. 数据定义
参考 `docs/architecture.md` 第 2 节。重要类型：
```ts
type Difficulty = 'easy' | 'medium' | 'hard';
interface User { id: number; email: string; displayName: string; createdAt: string; }
interface PuzzlePayload {
  difficulty: Difficulty;
  puzzle: number[][];
  solution: number[][];
  puzzleSeed: string;
  solutionSeed: string;
}
interface HistoryItem {
  id: number;
  difficulty: Difficulty;
  durationSeconds: number;
  mistakes: number;
  completedAt: string;
  puzzleSeed: string;
}

interface LeaderboardEntry {
  displayName: string;
  durationSeconds: number;
  mistakes: number;
  completedAt: string;
}
```

## 3. API 行为
| Endpoint | Method | 说明 |
| --- | --- | --- |
| `/api/auth/register` | POST | `zod` 校验 → 哈希密码 → 插入用户 → 签发 JWT Cookie（7 天）。冲突返回 409。 |
| `/api/auth/login` | POST | 校验邮箱/密码，错误统一 401 `INVALID_CREDENTIALS`。 |
| `/api/auth/logout` | POST | `res.clearCookie('auth_token')`。 |
| `/api/auth/me` | GET | 需 Cookie，返回 `AuthUser`。 |
| `/api/puzzle/new` | GET | Query `difficulty`，调用 `generatePuzzle`。返回 `puzzle/solution` 二维数组 + 种子。 |
| `/api/games/history` | GET | 需鉴权，按 `completed_at DESC` 列表。 |
| `/api/games/history` | POST | 校验体积，验证 `boardSnapshot` flatten 后与 `solutionSeed` 匹配，写入历史并回传 `HistoryItem`。 |
| `/api/leaderboard` | GET | Query: `difficulty`；返回 Top10（按 `duration_seconds ASC, mistakes ASC`）。 |

错误格式固定 `{ error: { code, message } }`，500 默认 `SERVER_ERROR`。

## 4. 前端交互规范
### 4.1 `App`
- 状态机：`status=idle|loading|ready`（来自 `useAuth`）。未 ready 前渲染 Loading。
- 登录后并行：
  1. `loadHistory()` → `GameAPI.fetchHistory()`
  2. `loadPuzzle(difficulty)` → `GameAPI.fetchPuzzle`
  两流程失败只在控制台提示，不中断 UI。
- `loadPuzzle` 重置：选中格、草稿、错误计数、计时器、提交状态、情绪反馈 Overlay、棋盘锁定状态。
- `history` 数组在提交成功后头插（避免重新拉取）。
- `leaderboard` 状态：`Record<Difficulty, LeaderboardEntry[]>`，首次展开某难度时请求 `/api/leaderboard` 并缓存（登录与否均可请求）。
- `difficultyMeta`：记录挖空范围描述、Brand 文案、失误上限（新手 8、进阶 5、专家 3）、鼓励/庆祝文案。
- `mistakes` ≥ 上限时：暂停计时、锁盘、弹出鼓励 Overlay（含再战按钮），不记录战绩。
- `boardEquals` 成功时：暂停计时、锁盘、展示胜利 Overlay（王子抱公主主题），随后调用 `submitHistory`。

### 4.2 `SudokuBoard`
- Props：
  - `board` 当前 9x9。
  - `notes` 三维 `boolean[][][]`，每格 9 位布尔表示 1~9。
  - `selected` 当前坐标，可为空。
  - `peerHighlights`：同行列/宫 set；`sameValueHighlights`：相同数字 set。
  - `noteMode`：草稿模式布尔；`onToggleNoteMode` 供 `N` 键切换。
  - `numberCounts`：`index=数字` 的已填数量。
  - `onInput({ row, col, value, mode })`：统一入口，`mode` 决定写 value 或 notes；若 `disabled`/锁盘则忽略。
- 行为：
  - 点击非禁用格 → 聚焦；点击已选格但 givens 为 true 时只做高亮不允许输入。
  - 数字按钮：展示剩余数（9-count）。当 `noteMode=true` 即使剩余 0 也允许点击。
  - 草稿渲染：空格 + 有 notes → 显示 3x3 grid 小字；`notes` 仅允许在空格写入。
  - 键盘：
    - `N` → 切换草稿模式；
    - Shift+数字 → 临时草稿；
    - 方向键在 0~8 范围内移动；
    - `Backspace/Delete/0` → 清空该格 value + notes。
  - 网格边界：利用 `subgrid-border-*` class + CSS `box-shadow` 实现 3x3 粗线，与 `conflict/peer/same-value` 共存。

### 4.3 `HistoryPanel`
- 读取 `items`。空数组时提示“暂无记录”。时间格式：`new Date(...).toLocaleString()`。

### 4.4 计时 & 提交
- `useTimer` 控制秒数。`loadPuzzle` 时 `reset()` 并 `start()`；暂停/继续可用。
- 棋盘对比 `boardEquals(board, puzzle.solution)` → true 时视为成功，先 `pause()` 再 `submitHistory`。提交成功后 `hasWon=true`，直到用户生成新题才复位。
- `feedbackOverlay`：成功或失败时渲染；按钮 `再战一局` 调用当前难度的 `loadPuzzle`；胜利弹窗提供“查看排行榜”锚点。

## 5. UI / UX 规则
- 颜色参考 `global.css`。高亮层级：`selected > same-value > peer > base`。
- Loading tag 直接用 `<span>`；可根据 `loadingPuzzle`/`submitting` 控制。
- 响应式：`@media (min-width: 1000px)` 采用 2 列布局；移动端单列。

## 6. Dev Notes & Reuse
- **Node 版本**：推荐 `nvm use 20`。若需 Node 25+，`better-sqlite3` 编译需 C++20/头文件支持。
- **TLS**：企业代理无法校验证书时，可临时 `NODE_TLS_REJECT_UNAUTHORIZED=0` 进行 `npm install`，但生产需配置 `npm config set cafile ...`。
- **启动脚本**：根目录 `npm run dev` → concurrently server + web；server 使用 `tsx watch`.
- **AI 复用建议**：
  - 优先阅读 `docs/prd.md` 和 `docs/architecture.md`，确认需求后再改代码。
  - 添加/修改功能时，同步更新文档时间戳。
  - 若实现新交互，扩展 `SudokuBoard` props + CSS，保持纯函数组件。

## 7. 测试策略
- 现阶段通过 `npm run lint -w web`、`npm run dev -w server` 自检。
- 建议补充：
  - 前端：使用 Playwright 录制核心流（登录→填局→提交）。
  - 后端：`jest`/`vitest` 对 `generatePuzzle`、`history` 路由做单测。

## 8. 风险 & 对策
| 风险 | 影响 | 对策 |
| --- | --- | --- |
| `better-sqlite3` 编译失败 | 安装中断 | 使用 Node LTS；若必须 Node 25，提前下载 headers 并设置 `CXXFLAGS="-std=c++20"`。 |
| JWT Secret 缺失 | 登录态无效 | `.env` 设置 `JWT_SECRET`；开发环境默认 `replace-me` 仅用于本地。 |
| 草稿状态失真 | 体验下降 | `notes` 仅在空格存在；写入值强制清空。 |

---
维护指南：节奏遵循“文档 → 代码 → 测试”。任何变更需更新 Last updated 字段。

