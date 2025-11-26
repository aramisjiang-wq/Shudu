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

app.use(
  cors({
    origin: config.clientOrigin,
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

