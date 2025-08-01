import { detectPackageManager } from './utils/detect';
import { updatePackageJson } from './utils/package';
import { installDependencies } from './utils/install';

export interface UpgradeOptions {
  skipInstall?: boolean;
}

export async function upgrade(
  projectPath: string = process.cwd(),
  options: UpgradeOptions = {},
) {
  try {
    const packageManager = detectPackageManager(projectPath);
    console.log(`📦 Detected package manager: ${packageManager}`);

    console.log('📝 Updating package.json...');
    updatePackageJson(projectPath, packageManager);
    console.log('✅ package.json updated successfully');

    if (!options.skipInstall) {
      console.log('📥 Installing dependencies...');
      installDependencies(projectPath, packageManager);
      console.log('✅ Dependencies installed successfully');
    }

    return {
      success: true,
      packageManager,
    };
  } catch (error) {
    console.error('❌ Error during upgrade:', error);
    throw error;
  }
}

export { detectPackageManager } from './utils/detect';
export { updatePackageJson } from './utils/package';
export { installDependencies } from './utils/install';
