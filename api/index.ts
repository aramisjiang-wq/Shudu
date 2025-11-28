import express, { type NextFunction, type Request, type Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from '../server/src/config.js';
import { initDb } from '../server/src/db.js';
import { authRouter } from '../server/src/routes/auth.js';
import { puzzleRouter } from '../server/src/routes/puzzle.js';
import { historyRouter } from '../server/src/routes/history.js';
import { leaderboardRouter } from '../server/src/routes/leaderboard.js';

// 初始化数据库
initDb();

const app = express();

// CORS 配置 - 允许 Vercel 域名
app.use(
  cors({
    origin: process.env.VERCEL_URL 
      ? [`https://${process.env.VERCEL_URL}`, 'http://localhost:5173']
      : config.clientOrigin,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// 健康检查
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// API 路由
app.use('/api/auth', authRouter);
app.use('/api/puzzle', puzzleRouter);
app.use('/api/games/history', historyRouter);
app.use('/api/leaderboard', leaderboardRouter);

// 错误处理
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: { code: 'SERVER_ERROR', message: '服务器开小差了' } });
});

// 导出为 Vercel Serverless Function
export default app;

