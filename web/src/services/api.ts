import type { Difficulty, HistoryItem, LeaderboardEntry, PuzzlePayload, User } from '../types';

// API 基础地址配置
// 必须在运行时（浏览器环境）动态获取，不能依赖构建时
const getApiBase = (): string => {
  // 1. 优先使用环境变量（Vercel 构建时注入）
  const envApiUrl = import.meta.env.VITE_API_URL;
  if (envApiUrl && typeof envApiUrl === 'string' && envApiUrl.trim() !== '') {
    console.log('[API Config] Using VITE_API_URL:', envApiUrl);
    return envApiUrl.trim();
  }
  
  // 2. 运行时判断（必须在浏览器环境，构建时 window 不存在）
  if (typeof window !== 'undefined' && window.location && window.location.hostname) {
    const hostname = window.location.hostname.toLowerCase();
    console.log('[API Config] Detected hostname:', hostname);
    
    // 开发环境：localhost，使用空字符串（走 vite proxy）
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0') {
      console.log('[API Config] Development mode, using proxy');
      return '';
    }
    
    // 生产环境（Vercel 域名）：使用 Railway 后端
    // 检查是否是 Vercel 域名或其他生产域名
    if (
      hostname.includes('vercel.app') || 
      hostname.includes('netlify.app') || 
      hostname.includes('github.io') ||
      hostname.includes('vercel.com')
    ) {
      console.log('[API Config] Production mode (Vercel), using Railway backend');
      return 'https://shudu-production.up.railway.app';
    }
    
    // 其他生产域名也使用 Railway
    console.log('[API Config] Production mode (other), using Railway backend');
    return 'https://shudu-production.up.railway.app';
  }
  
  // 3. 构建时回退：生产构建默认使用 Railway
  // 这会在 SSR 或构建时使用（此时 window 不存在）
  console.log('[API Config] Build time fallback, using Railway backend');
  return 'https://shudu-production.up.railway.app';
};

const handleResponse = async (res: Response) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data?.error?.message ?? '请求失败';
    throw new Error(message);
  }
  return data;
};

const request = (input: RequestInfo, init?: RequestInit) => {
  // 每次请求时重新计算，确保获取最新的 hostname（不能缓存）
  const apiBase = getApiBase();
  
  // 我们的代码中 input 总是字符串，直接拼接
  const url = typeof input === 'string' ? `${apiBase}${input}` : input;
  
  // 调试输出（每次请求都输出，方便排查）
  if (typeof window !== 'undefined') {
    const urlString = typeof url === 'string' ? url : url instanceof Request ? url.url : url.toString();
    console.log('🔧 API Request:', {
      apiBase,
      url: urlString,
      hostname: window.location.hostname,
      VITE_API_URL: import.meta.env.VITE_API_URL || 'not set',
      MODE: import.meta.env.MODE,
      PROD: import.meta.env.PROD,
    });
    
    // 如果 apiBase 为空但 hostname 是 Vercel，说明检测失败，强制使用 Railway
    if (!apiBase && window.location.hostname.includes('vercel.app')) {
      console.error('❌ API Base is empty but hostname is Vercel! Forcing Railway backend.');
      const correctedUrl = typeof input === 'string' 
        ? `https://shudu-production.up.railway.app${input}` 
        : url;
      return fetch(correctedUrl, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(init?.headers ?? {}),
        },
        ...init,
      });
    }
  }
  
  return fetch(url, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  });
};

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
