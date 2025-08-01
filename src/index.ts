import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import chalk from 'chalk';

// 检测包管理器类型
function detectPackageManager(projectPath: string): string {
  const files = fs.readdirSync(projectPath);
  if (files.includes('pnpm-lock.yaml')) return 'pnpm';
  if (files.includes('yarn.lock')) return 'yarn';
  if (files.includes('bun.lockb')) return 'bun';
  if (files.includes('package-lock.json')) return 'npm';
  return 'npm';
}

// 更新 package.json
function updatePackageJson(projectPath: string, packageManager: string) {
  const packageJsonPath = path.join(projectPath, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  // 检查是否有直接依赖 vite
  const hasDirectViteDep =
    packageJson.dependencies?.vite || packageJson.devDependencies?.vite;

  if (hasDirectViteDep) {
    if (packageJson.dependencies?.vite) {
      packageJson.dependencies.vite = 'npm:rolldown-vite@latest';
    }
    if (packageJson.devDependencies?.vite) {
      packageJson.devDependencies.vite = 'npm:rolldown-vite@latest';
    }
  }

  // 根据包管理器添加覆盖配置
  switch (packageManager) {
    case 'npm':
    case 'bun':
      packageJson.overrides = {
        ...packageJson.overrides,
        vite: 'npm:rolldown-vite@latest',
      };
      break;
    case 'yarn':
      packageJson.resolutions = {
        ...packageJson.resolutions,
        vite: 'npm:rolldown-vite@latest',
      };
      break;
    case 'pnpm':
      packageJson.pnpm = {
        ...packageJson.pnpm,
        overrides: {
          ...packageJson.pnpm?.overrides,
          vite: 'npm:rolldown-vite@latest',
        },
      };
      break;
  }

  // 写入更新后的 package.json
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
}

// 执行命令并处理错误
function execCommand(command: string, cwd: string): boolean {
  try {
    execSync(command, {
      cwd,
      stdio: 'inherit',
      env: { ...process.env, FORCE_COLOR: 'true' },
    });
    return true;
  } catch (error) {
    console.error(chalk.red(`执行命令 "${command}" 失败:`));
    console.error(error);
    return false;
  }
}

// 安装依赖并构建
function installAndBuild(projectPath: string, packageManager: string): boolean {
  console.log(chalk.blue('📦 正在安装依赖...'));

  const installCommand =
    packageManager === 'yarn'
      ? 'yarn'
      : packageManager === 'pnpm'
        ? 'pnpm install'
        : packageManager === 'bun'
          ? 'bun install'
          : 'npm install';

  if (!execCommand(installCommand, projectPath)) {
    return false;
  }

  console.log(chalk.blue('🛠️ 正在构建项目...'));

  const buildCommand =
    packageManager === 'yarn'
      ? 'yarn build'
      : packageManager === 'pnpm'
        ? 'pnpm build'
        : packageManager === 'bun'
          ? 'bun run build'
          : 'npm run build';

  return execCommand(buildCommand, projectPath);
}

// 备份 package.json
function backupPackageJson(projectPath: string): void {
  const packageJsonPath = path.join(projectPath, 'package.json');
  const backupPath = path.join(projectPath, 'package.json.backup');
  fs.copyFileSync(packageJsonPath, backupPath);
}

// 恢复 package.json
function restorePackageJson(projectPath: string): void {
  const packageJsonPath = path.join(projectPath, 'package.json');
  const backupPath = path.join(projectPath, 'package.json.backup');
  if (fs.existsSync(backupPath)) {
    fs.copyFileSync(backupPath, packageJsonPath);
    fs.unlinkSync(backupPath);
  }
}

interface UpgradeOptions {
  skipInstall?: boolean;
  skipBuild?: boolean;
}

// 主函数
export async function upgrade(
  projectPath: string = process.cwd(),
  options: UpgradeOptions = {},
) {
  try {
    console.log(chalk.blue('🚀 开始升级到 rolldown-vite...'));

    // 检测包管理器
    const packageManager = detectPackageManager(projectPath);
    console.log(chalk.blue(`📦 检测到包管理器：${packageManager}`));

    // 备份 package.json
    backupPackageJson(projectPath);

    // 更新 package.json
    console.log(chalk.blue('📝 更新 package.json...'));
    updatePackageJson(projectPath, packageManager);
    console.log(chalk.green('✅ package.json 更新成功'));

    if (!options.skipInstall) {
      // 安装依赖并构建
      if (!installAndBuild(projectPath, packageManager)) {
        console.log(chalk.yellow('⚠️ 还原 package.json...'));
        restorePackageJson(projectPath);
        throw new Error('升级失败');
      }
    }

    // 删除备份文件
    const backupPath = path.join(projectPath, 'package.json.backup');
    if (fs.existsSync(backupPath)) {
      fs.unlinkSync(backupPath);
    }

    console.log(chalk.green('✨ 升级完成！'));
    return {
      success: true,
      packageManager,
    };
  } catch (error) {
    console.error(chalk.red('❌ 升级过程中出现错误：'), error);
    throw error;
  }
}

// 导出工具函数
export { detectPackageManager } from './utils/detect';
export { updatePackageJson } from './utils/package';
