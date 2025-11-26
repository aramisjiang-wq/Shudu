import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { db } from '../db.js';
import { config } from '../config.js';
import type { AuthUser } from '../types.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(64),
  displayName: z.string().min(2).max(40),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(64),
});

interface UserRow {
  id: number;
  email: string;
  display_name: string;
  password_hash: string;
  created_at: string;
}

const toAuthUser = (row: UserRow): AuthUser => ({
  id: row.id,
  email: row.email,
  displayName: row.display_name,
  createdAt: row.created_at,
});

const signToken = (user: AuthUser) =>
  jwt.sign(
    {
      sub: user.id,
      email: user.email,
      displayName: user.displayName,
      createdAt: user.createdAt,
    },
    config.jwtSecret,
    { expiresIn: '7d' }
  );

const cookieOptions = {
  httpOnly: true,
  sameSite: 'strict' as const,
  secure: config.nodeEnv === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',
};

router.post('/register', (req, res) => {
  const result = registerSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: result.error.message } });
  }
  const { email, password, displayName } = result.data;
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    return res.status(409).json({ error: { code: 'EMAIL_EXISTS', message: '邮箱已被注册' } });
  }
  const passwordHash = bcrypt.hashSync(password, 10);
  const info = db
    .prepare('INSERT INTO users (email, display_name, password_hash) VALUES (?, ?, ?)')
    .run(email, displayName, passwordHash);
  const created = db
    .prepare('SELECT * FROM users WHERE id = ?')
    .get(info.lastInsertRowid) as UserRow;
  const user = toAuthUser(created);
  const token = signToken(user);
  res.cookie('auth_token', token, cookieOptions);
  return res.status(201).json({ user });
});

router.post('/login', (req, res) => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: result.error.message } });
  }
  const { email, password } = result.data;
  const row = db
    .prepare('SELECT * FROM users WHERE email = ?')
    .get(email) as UserRow | undefined;
  if (!row) {
    return res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: '账号或密码错误' } });
  }
  const match = bcrypt.compareSync(password, row.password_hash);
  if (!match) {
    return res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: '账号或密码错误' } });
  }
  const user = toAuthUser(row);
  const token = signToken(user);
  res.cookie('auth_token', token, cookieOptions);
  return res.json({ user });
});

router.post('/logout', (_req, res) => {
  res.clearCookie('auth_token', { path: '/' });
  return res.status(204).send();
});

router.get('/me', requireAuth, (req, res) => {
  return res.json({ user: req.user });
});

export const authRouter = router;

