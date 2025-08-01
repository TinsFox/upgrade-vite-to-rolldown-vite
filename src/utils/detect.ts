import fs from 'fs';
import path from 'path';

export function detectPackageManager(projectPath: string): string {
  const files = fs.readdirSync(projectPath);
  if (files.includes('yarn.lock')) return 'yarn';
  if (files.includes('pnpm-lock.yaml')) return 'pnpm';
  if (files.includes('bun.lockb')) return 'bun';
  if (files.includes('package-lock.json')) return 'npm';
  return 'npm';
}
