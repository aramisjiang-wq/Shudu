import type { Request, Response, NextFunction } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { config } from '../config.js';
import type { AuthUser } from '../types.js';

interface TokenPayload {
  sub: number;
  email: string;
  displayName: string;
  createdAt: string;
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.auth_token;
  if (!token) {
    return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: '未登录' } });
  }
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    if (typeof decoded !== 'object' || decoded === null) {
      throw new Error('Invalid token payload');
    }
    const payload = decoded as JwtPayload & TokenPayload;
    if (typeof payload.sub !== 'number') {
      throw new Error('Invalid token subject');
    }
    const user: AuthUser = {
      id: payload.sub,
      email: payload.email,
      displayName: payload.displayName,
      createdAt: payload.createdAt,
    };
    req.user = user;
    return next();
  } catch {
    return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: '登录态失效' } });
  }
};

