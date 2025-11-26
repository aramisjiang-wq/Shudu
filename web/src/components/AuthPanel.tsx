import { FormEvent, useState } from 'react';

interface Props {
  onLogin: (payload: { email: string; password: string }) => Promise<void>;
  onRegister: (payload: { email: string; password: string; displayName: string }) => Promise<void>;
  busy: boolean;
  error: string | null;
  clearError: () => void;
}

const AuthPanel = ({ onLogin, onRegister, busy, error, clearError }: Props) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState({ email: '', password: '', displayName: '' });

  const handleSubmit = async (evt: FormEvent) => {
    evt.preventDefault();
    clearError();
    if (mode === 'login') {
      await onLogin({ email: form.email, password: form.password });
    } else {
      await onRegister(form);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <div className="sudoku-grid">
              <div className="sudoku-cell"></div>
              <div className="sudoku-cell filled"></div>
              <div className="sudoku-cell"></div>
              <div className="sudoku-cell"></div>
              <div className="sudoku-cell filled"></div>
              <div className="sudoku-cell"></div>
              <div className="sudoku-cell"></div>
              <div className="sudoku-cell filled"></div>
              <div className="sudoku-cell"></div>
            </div>
          </div>
          <h1 className="auth-title">Sudoku Arena</h1>
          <p className="auth-subtitle">挑战思维极限，征服数字迷宫</p>
        </div>
        
        <div className="auth-tabs">
          <button
            className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
            type="button"
            onClick={() => {
              setMode('login');
              clearError();
            }}
          >
            登录
          </button>
          <button
            className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
            type="button"
            onClick={() => {
              setMode('register');
              clearError();
            }}
          >
            注册
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'register' && (
            <div className="input-group">
              <label htmlFor="displayName">昵称</label>
              <input
                id="displayName"
                type="text"
                value={form.displayName}
                onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))}
                placeholder="请输入您的昵称"
                required
                minLength={2}
              />
            </div>
          )}
          
          <div className="input-group">
            <label htmlFor="email">邮箱</label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="请输入邮箱地址"
              required
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="password">密码</label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              placeholder="请输入密码（至少8位）"
              required
              minLength={8}
            />
          </div>
          
          {error && (
            <div className="auth-error">
              <span>⚠️</span>
              {error}
            </div>
          )}
          
          <button 
            type="submit" 
            className="auth-submit-btn" 
            disabled={busy}
          >
            {busy ? (
              <span className="loading-spinner"></span>
            ) : (
              mode === 'login' ? '登录游戏' : '创建账号'
            )}
          </button>
        </form>
        
        <div className="auth-footer">
          <p className="auth-footer-text">
            {mode === 'login' ? '还没有账号？' : '已有账号？'}
            <button 
              className="auth-link"
              type="button"
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                clearError();
              }}
            >
              {mode === 'login' ? '立即注册' : '立即登录'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPanel;

