#!/bin/bash

# 前端 API 配置脚本
# 用于连接 Railway 后端

echo "╔══════════════════════════════════════════════════════════════════════╗"
echo "║              🔗 前端 API 配置脚本                                     ║"
echo "╚══════════════════════════════════════════════════════════════════════╝"
echo ""

# 检查是否提供了 Railway URL
if [ -z "$1" ]; then
    echo "❌ 错误：请提供 Railway 后端 URL"
    echo ""
    echo "使用方法："
    echo "  ./setup-frontend-api.sh https://your-app.up.railway.app"
    echo ""
    exit 1
fi

RAILWAY_URL=$1

echo "📝 配置信息："
echo "  Railway 后端: $RAILWAY_URL"
echo ""

# 创建 .env.production 文件
echo "✅ 创建 web/.env.production..."
cat > web/.env.production << EOF
VITE_API_URL=$RAILWAY_URL
EOF

echo "✅ 已创建 web/.env.production"
echo ""

# 更新 api.ts
echo "✅ 更新 web/src/services/api.ts..."
cat > web/src/services/api.ts.new << 'EOF'
import type { Difficulty, HistoryItem, LeaderboardEntry, PuzzlePayload, User } from '../types';

// API 基础地址
const API_BASE = import.meta.env.VITE_API_URL || '';

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
EOF

# 备份原文件
if [ -f "web/src/services/api.ts" ]; then
    cp web/src/services/api.ts web/src/services/api.ts.backup
    echo "✅ 已备份原文件到 api.ts.backup"
fi

mv web/src/services/api.ts.new web/src/services/api.ts
echo "✅ 已更新 api.ts"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ 配置完成！"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 下一步："
echo "  1. 提交更改："
echo "     git add ."
echo "     git commit -m '🔗 连接 Railway 后端'"
echo "     git push origin main"
echo ""
echo "  2. 等待 Vercel 自动部署（约 2 分钟）"
echo ""
echo "  3. 测试应用："
echo "     https://shudu-eosin.vercel.app"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

