import path from 'node:path';
import process from 'node:process';
import { defineConfig } from 'vitest/config';
import pkg from './package.json';

export default defineConfig({
  resolve: {
    alias:
      process.env.NODE_ENV === 'production'
        ? []
        : [{ find: /@lowcode\/(.*)/, replacement: path.join(__dirname, '../$1/src') }],
  },
  test: {
    include: ['src/tests/**/*.spec.ts'],
    globals: true,
  },
  build: {
    sourcemap: true,
    cssCodeSplit: false,
    minify: false,
    target: 'esnext',
    lib: {
      entry: 'src/index.ts',
      name: 'LowCodeDSLResolver',
      fileName: 'lowcode-dsl-resolver',
    },

    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external(id: string) {
        return Object.keys(pkg.dependencies).some(k => new RegExp(`^${k}`).test(id));
      },
    },
  },
});
