const handleResponse = async (res) => {
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        const message = data?.error?.message ?? '请求失败';
        throw new Error(message);
    }
    return data;
};
const request = (input, init) => fetch(input, {
    credentials: 'include',
    headers: {
        'Content-Type': 'application/json',
        ...(init?.headers ?? {}),
    },
    ...init,
});
export const AuthAPI = {
    async me() {
        const res = await request('/api/auth/me');
        if (res.status === 401)
            return null;
        const data = await handleResponse(res);
        return data.user;
    },
    async register(payload) {
        const res = await request('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
        const data = await handleResponse(res);
        return data.user;
    },
    async login(payload) {
        const res = await request('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
        const data = await handleResponse(res);
        return data.user;
    },
    async logout() {
        await request('/api/auth/logout', { method: 'POST' });
    },
};
export const GameAPI = {
    async fetchPuzzle(difficulty) {
        const res = await request(`/api/puzzle/new?difficulty=${difficulty}`);
        const data = await handleResponse(res);
        return data;
    },
    async fetchHistory() {
        const res = await request('/api/games/history');
        const data = await handleResponse(res);
        return data.history;
    },
    async fetchLeaderboard(difficulty) {
        const res = await request(`/api/leaderboard?difficulty=${difficulty}`);
        const data = await handleResponse(res);
        return data.items;
    },
    async submitHistory(payload) {
        const res = await request('/api/games/history', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
        const data = await handleResponse(res);
        return data.item;
    },
};
