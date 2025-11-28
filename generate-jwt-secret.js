#!/usr/bin/env node

/**
 * 生成 JWT 密钥
 * 用于 Railway 或其他部署平台的环境变量
 */

const crypto = require('crypto');

console.log('╔══════════════════════════════════════════════════════════════════════╗');
console.log('║                    🔐 JWT 密钥生成器                                  ║');
console.log('╚══════════════════════════════════════════════════════════════════════╝');
console.log('');

// 生成 32 字节的随机密钥
const secret = crypto.randomBytes(32).toString('hex');

console.log('✅ 已生成 JWT 密钥：');
console.log('');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(secret);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('');
console.log('📋 使用方法：');
console.log('');
console.log('1. Railway 部署：');
console.log('   - 进入项目 Settings → Variables');
console.log('   - 添加变量：JWT_SECRET');
console.log('   - 粘贴上面的密钥');
console.log('');
console.log('2. Vercel 部署：');
console.log('   - 进入项目 Settings → Environment Variables');
console.log('   - 添加变量：JWT_SECRET');
console.log('   - 粘贴上面的密钥');
console.log('');
console.log('3. 本地开发：');
console.log('   - 创建 .env 文件');
console.log('   - 添加：JWT_SECRET=' + secret);
console.log('');
console.log('⚠️  重要提示：');
console.log('   - 请妥善保管此密钥');
console.log('   - 不要提交到 Git');
console.log('   - 生产环境使用强密钥');
console.log('');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

