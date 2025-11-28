import type { Difficulty, HistoryItem, LeaderboardEntry, PuzzlePayload, User } from '../types';

// API 基础地址
// 生产环境默认使用 Railway 后端
const API_BASE = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? 'https://shudu-production.up.railway.app' : '');

const handleResponse = async (res: Response) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data?.error?.message ?? '请求失败';
    throw new Error(message);
  }
  return data;
};

const request = (input: RequestInfo, init?: RequestInit) =>
  fetch(`${API_BASE}${input}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  });

export const AuthAPI = {
  async me(): Promise<User | null> {
    const res = await request('/api/auth/me');
    if (res.status === 401) return null;
    const data = await handleResponse(res);
    return data.user;
  },
  async register(payload: { email: string; password: string; displayName: string }) {
    const res = await request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    const data = await handleResponse(res);
    return data.user as User;
  },
  async login(payload: { email: string; password: string }) {
    const res = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    const data = await handleResponse(res);
    return data.user as User;
  },
  async logout() {
    await request('/api/auth/logout', { method: 'POST' });
  },
};

export const GameAPI = {
  async fetchPuzzle(difficulty: Difficulty): Promise<PuzzlePayload> {
    const res = await request(`/api/puzzle/new?difficulty=${difficulty}`);
    const data = await handleResponse(res);
    return data as PuzzlePayload & { difficulty: Difficulty };
  },
  async fetchHistory(): Promise<HistoryItem[]> {
    const res = await request('/api/games/history');
    const data = await handleResponse(res);
    return data.history as HistoryItem[];
  },
  async fetchLeaderboard(difficulty: Difficulty): Promise<LeaderboardEntry[]> {
    const res = await request(`/api/leaderboard?difficulty=${difficulty}`);
    const data = await handleResponse(res);
    return data.items as LeaderboardEntry[];
  },
  async submitHistory(payload: {
    difficulty: Difficulty;
    durationSeconds: number;
    mistakes: number;
    puzzleSeed: string;
    solutionSeed: string;
    boardSnapshot: number[][];
  }) {
    const res = await request('/api/games/history', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    const data = await handleResponse(res);
    return data.item as HistoryItem;
  },
};
