export type Difficulty = 'easy' | 'medium' | 'hard';

export interface User {
  id: number;
  email: string;
  displayName: string;
  createdAt: string;
}

export interface PuzzlePayload {
  difficulty: Difficulty;
  puzzle: number[][];
  solution: number[][];
  puzzleSeed: string;
  solutionSeed: string;
}

export interface HistoryItem {
  id: number;
  difficulty: Difficulty;
  durationSeconds: number;
  mistakes: number;
  completedAt: string;
  puzzleSeed: string;
}

export interface LeaderboardEntry {
  displayName: string;
  durationSeconds: number;
  mistakes: number;
  completedAt: string;
}

