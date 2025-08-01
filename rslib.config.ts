import { defineConfig } from '@rslib/core';

export default defineConfig({
  // 配置入口文件
  source: {
    entry: {
      index: './src/index.ts',
      'bin/cli': './src/bin/cli.ts',
    },
  },

  lib: [
    {
      format: 'esm',
      bundle: true,
      dts: true,
      banner: {
        js: '#!/usr/bin/env node',
      },
      output: {
        target: 'node',
        distPath: {
          root: 'dist',
        },
      },
    },
  ],
});
