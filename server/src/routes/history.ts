import { Router } from 'express';
import { z } from 'zod';
import { db } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import type { Difficulty } from '../types.js';

const router = Router();

const boardSchema = z
  .array(z.array(z.number().int().min(0).max(9)).length(9))
  .length(9);

const historyBodySchema = z.object({
  difficulty: z.enum(['easy', 'medium', 'hard']),
  durationSeconds: z.number().int().min(1).max(24 * 60 * 60),
  mistakes: z.number().int().min(0).max(100),
  puzzleSeed: z.string().length(81),
  solutionSeed: z.string().length(81),
  boardSnapshot: boardSchema,
});

router.get('/', requireAuth, (req, res) => {
  const rows = db
    .prepare(
      `SELECT id, difficulty, duration_seconds, mistakes, completed_at, puzzle_seed 
       FROM game_history WHERE user_id = ? ORDER BY completed_at DESC`
    )
    .all(req.user!.id) as {
      id: number;
      difficulty: Difficulty;
      duration_seconds: number;
      mistakes: number;
      completed_at: string;
      puzzle_seed: string;
    }[];
  return res.json({
    history: rows.map((row) => ({
      id: row.id,
      difficulty: row.difficulty,
      durationSeconds: row.duration_seconds,
      mistakes: row.mistakes,
      completedAt: row.completed_at,
      puzzleSeed: row.puzzle_seed,
    })),
  });
});

router.post('/', requireAuth, (req, res) => {
  const result = historyBodySchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: result.error.message } });
  }
  const { difficulty, durationSeconds, mistakes, puzzleSeed, solutionSeed, boardSnapshot } = result.data;
  const flattenedBoard = boardSnapshot.flat().join('');
  if (flattenedBoard !== solutionSeed) {
    return res.status(400).json({ error: { code: 'INVALID_SOLUTION', message: '提交内容与解答不符' } });
  }
  const completedAt = new Date().toISOString();
  const insert = db
    .prepare(
      `INSERT INTO game_history 
        (user_id, difficulty, duration_seconds, mistakes, completed_at, puzzle_seed, solution_seed, board_snapshot)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      req.user!.id,
      difficulty,
      durationSeconds,
      mistakes,
      completedAt,
      puzzleSeed,
      solutionSeed,
      JSON.stringify(boardSnapshot)
    );
  return res.status(201).json({
    item: {
      id: insert.lastInsertRowid,
      difficulty,
      durationSeconds,
      mistakes,
      completedAt,
      puzzleSeed,
    },
  });
});

export const historyRouter = router;

