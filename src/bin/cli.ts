#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import { upgrade } from '../index';

const program = new Command();

program
  .name('vite-rolldown-upgrade')
  .description('Upgrade your Vite project to use rolldown-vite')
  .option('-s, --skip-install', 'Skip dependency installation')
  .option('-p, --path <path>', 'Project path', process.cwd())
  .action(async (options) => {
    try {
      console.log(chalk.blue('Starting upgrade to rolldown-vite...'));

      await upgrade(options.path, {
        skipInstall: options.skipInstall,
      });

      console.log(chalk.green('\n✨ Upgrade completed successfully!'));
    } catch (error) {
      console.error(chalk.red('\n❌ Upgrade failed:'), error);
      process.exit(1);
    }
  });

program.parse();
