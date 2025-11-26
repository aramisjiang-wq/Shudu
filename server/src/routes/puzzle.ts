import { Router } from 'express';
import { z } from 'zod';
import { generatePuzzle } from '../sudoku/generator.js';

const router = Router();

const querySchema = z.object({
  difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
});

router.get('/new', (req, res) => {
  const result = querySchema.safeParse(req.query);
  if (!result.success) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: result.error.message } });
  }
  const { difficulty } = result.data;
  const puzzle = generatePuzzle(difficulty);
  return res.json({
    difficulty,
    puzzle: puzzle.puzzle,
    solution: puzzle.solution,
    puzzleSeed: puzzle.puzzleSeed,
    solutionSeed: puzzle.solutionSeed,
  });
});

export const puzzleRouter = router;

