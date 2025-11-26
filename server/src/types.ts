export type Difficulty = 'easy' | 'medium' | 'hard';

export interface AuthUser {
  id: number;
  email: string;
  displayName: string;
  createdAt: string;
}

export interface LeaderboardEntry {
  displayName: string;
  durationSeconds: number;
  mistakes: number;
  completedAt: string;
}

