import { Router } from 'express';
import { z } from 'zod';
import { db } from '../db.js';

const router = Router();

const querySchema = z.object({
  difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
});

router.get('/', (req, res) => {
  const result = querySchema.safeParse(req.query);
  if (!result.success) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: result.error.message } });
  }
  const { difficulty } = result.data;
  const rows = db
    .prepare(
      `SELECT u.display_name AS displayName,
              g.duration_seconds AS durationSeconds,
              g.mistakes,
              g.completed_at AS completedAt
         FROM game_history g
         JOIN users u ON u.id = g.user_id
        WHERE g.difficulty = ?
        ORDER BY g.duration_seconds ASC, g.mistakes ASC, g.completed_at ASC
        LIMIT 10`
    )
    .all(difficulty);
  return res.json({ items: rows });
});

export const leaderboardRouter = router;

