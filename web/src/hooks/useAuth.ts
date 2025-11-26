import { useCallback, useEffect, useState } from 'react';
import { AuthAPI } from '../services/api';
import type { User } from '../types';

type AuthStatus = 'idle' | 'loading' | 'ready';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [authBusy, setAuthBusy] = useState(false);

  const bootstrap = useCallback(async () => {
    setStatus('loading');
    try {
      const me = await AuthAPI.me();
      setUser(me);
    } catch (err) {
      console.error(err);
    } finally {
      setStatus('ready');
    }
  }, []);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  const handleAuthError = (err: unknown) => {
    if (err instanceof Error) setError(err.message);
    else setError('发生未知错误');
  };

  const login = async (payload: { email: string; password: string }) => {
    setAuthBusy(true);
    setError(null);
    try {
      const loggedIn = await AuthAPI.login(payload);
      setUser(loggedIn);
    } catch (err) {
      handleAuthError(err);
      throw err;
    } finally {
      setAuthBusy(false);
    }
  };

  const register = async (payload: { email: string; password: string; displayName: string }) => {
    setAuthBusy(true);
    setError(null);
    try {
      const created = await AuthAPI.register(payload);
      setUser(created);
    } catch (err) {
      handleAuthError(err);
      throw err;
    } finally {
      setAuthBusy(false);
    }
  };

  const logout = async () => {
    await AuthAPI.logout();
    setUser(null);
  };

  return {
    user,
    status,
    error,
    authBusy,
    login,
    register,
    logout,
    clearError: () => setError(null),
  };
};

