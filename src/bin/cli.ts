#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import { upgrade } from '../index';

const program = new Command();

program
  .name('vite-rolldown-upgrade')
  .description('将 Vite 项目升级到 rolldown-vite')
  .option('-s, --skip-install', '跳过依赖安装')
  .option('-p, --path <path>', '项目路径', process.cwd())
  .option('-b, --skip-build', '跳过构建步骤')
  .action(async (options) => {
    try {
      await upgrade(options.path, {
        skipInstall: options.skipInstall,
        skipBuild: options.skipBuild,
      });
    } catch (error) {
      console.error(chalk.red('\n❌ 升级失败：'), error);
      process.exit(1);
    }
  });

program.parse();
