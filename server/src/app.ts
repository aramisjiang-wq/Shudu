import express, { type NextFunction, type Request, type Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './config.js';
import { initDb } from './db.js';
import { authRouter } from './routes/auth.js';
import { puzzleRouter } from './routes/puzzle.js';
import { historyRouter } from './routes/history.js';
import { leaderboardRouter } from './routes/leaderboard.js';

initDb();

const app = express();

// CORS 配置 - 支持多个 origin
const allowedOrigins = [
  config.clientOrigin,
  'https://shudu-eosin.vercel.app',
  'http://localhost:5173',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // 允许没有 origin 的请求（如 Postman、curl）
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.use('/api/auth', authRouter);
app.use('/api/puzzle', puzzleRouter);
app.use('/api/games/history', historyRouter);
app.use('/api/leaderboard', leaderboardRouter);

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: { code: 'SERVER_ERROR', message: '服务器开小差了' } });
});

app.listen(config.port, () => {
  console.log(`Server listening on http://localhost:${config.port}`);
});

