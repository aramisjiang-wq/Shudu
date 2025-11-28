import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: Number(process.env.PORT ?? process.env.SERVER_PORT ?? 8080),
  jwtSecret: process.env.JWT_SECRET ?? 'replace-me',
  clientOrigin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173',
  nodeEnv: process.env.NODE_ENV ?? 'development',
};

