import fs from 'fs';
import path from 'path';

export interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  overrides?: Record<string, string>;
  resolutions?: Record<string, string>;
  pnpm?: {
    overrides?: Record<string, string>;
  };
}

export function updatePackageJson(
  projectPath: string,
  packageManager: string,
): void {
  const packageJsonPath = path.join(projectPath, 'package.json');
  const packageJson: PackageJson = JSON.parse(
    fs.readFileSync(packageJsonPath, 'utf8'),
  );

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

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
}
