import { execSync } from 'child_process';

export function installDependencies(
  projectPath: string,
  packageManager: string,
): void {
  const command =
    packageManager === 'yarn'
      ? 'yarn'
      : packageManager === 'pnpm'
        ? 'pnpm install'
        : packageManager === 'bun'
          ? 'bun install'
          : 'npm install';

  execSync(command, {
    cwd: projectPath,
    stdio: 'inherit',
  });
}
