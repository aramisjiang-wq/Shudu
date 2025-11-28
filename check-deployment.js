#!/usr/bin/env node

/**
 * 部署前检查脚本
 * 检查项目配置是否正确
 */

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

const errors = [];
const warnings = [];
const success = [];

console.log('🔍 检查部署配置...\n');

// 1. 检查必需文件
const requiredFiles = [
  'vercel.json',
  'package.json',
  'web/package.json',
  'server/package.json',
  'api/index.ts',
];

requiredFiles.forEach(file => {
  if (existsSync(file)) {
    success.push(`✅ ${file} 存在`);
  } else {
    errors.push(`❌ 缺少文件: ${file}`);
  }
});

// 2. 检查 package.json 脚本
try {
  const pkg = JSON.parse(readFileSync('package.json', 'utf-8'));
  if (pkg.scripts?.['vercel-build']) {
    success.push('✅ vercel-build 脚本已配置');
  } else {
    warnings.push('⚠️  缺少 vercel-build 脚本');
  }
} catch (e) {
  errors.push('❌ 无法读取 package.json');
}

// 3. 检查 vercel.json 配置
try {
  const vercelConfig = JSON.parse(readFileSync('vercel.json', 'utf-8'));
  
  if (vercelConfig.builds && vercelConfig.builds.length > 0) {
    success.push('✅ Vercel builds 配置正确');
  } else {
    errors.push('❌ Vercel builds 配置缺失');
  }
  
  if (vercelConfig.routes && vercelConfig.routes.length > 0) {
    success.push('✅ Vercel routes 配置正确');
  } else {
    errors.push('❌ Vercel routes 配置缺失');
  }
} catch (e) {
  errors.push('❌ vercel.json 配置错误');
}

// 4. 检查环境变量示例
if (existsSync('env.example')) {
  success.push('✅ 环境变量示例文件存在');
} else {
  warnings.push('⚠️  建议创建 env.example 文件');
}

// 5. 检查 .gitignore
if (existsSync('.gitignore')) {
  const gitignore = readFileSync('.gitignore', 'utf-8');
  if (gitignore.includes('node_modules') && gitignore.includes('.env')) {
    success.push('✅ .gitignore 配置正确');
  } else {
    warnings.push('⚠️  .gitignore 可能需要更新');
  }
}

// 6. 检查前端构建
if (existsSync('web/dist')) {
  success.push('✅ 前端已构建（web/dist 存在）');
} else {
  warnings.push('⚠️  前端未构建，运行: npm run build -w web');
}

// 输出结果
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

if (success.length > 0) {
  console.log('✅ 成功项：');
  success.forEach(msg => console.log(`   ${msg}`));
  console.log('');
}

if (warnings.length > 0) {
  console.log('⚠️  警告项：');
  warnings.forEach(msg => console.log(`   ${msg}`));
  console.log('');
}

if (errors.length > 0) {
  console.log('❌ 错误项：');
  errors.forEach(msg => console.log(`   ${msg}`));
  console.log('');
}

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

if (errors.length === 0) {
  console.log('🎉 配置检查通过！可以开始部署了。\n');
  console.log('📖 部署步骤：');
  console.log('   1. 推送代码到 GitHub');
  console.log('   2. 访问 https://vercel.com');
  console.log('   3. 导入仓库并配置环境变量');
  console.log('   4. 点击部署\n');
  console.log('📚 详细文档: ./DEPLOYMENT.md\n');
  process.exit(0);
} else {
  console.log('❌ 发现配置问题，请修复后再部署。\n');
  console.log('💡 提示：');
  console.log('   - 确保所有必需文件存在');
  console.log('   - 检查 vercel.json 配置');
  console.log('   - 运行 npm install 安装依赖\n');
  process.exit(1);
}

