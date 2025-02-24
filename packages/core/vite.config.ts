import path from 'node:path';
import process from 'node:process';
import { defineConfig } from 'vite';
import pkg from './package.json';

export default defineConfig({
  resolve: {
    alias:
      process.env.NODE_ENV === 'production'
        ? []
        : [{ find: /@lowcode\/(.*)/, replacement: path.join(__dirname, '../$1/src') }],
  },
  build: {
    sourcemap: true,
    cssCodeSplit: false,
    minify: false,
    target: 'esnext',
    lib: {
      entry: 'src/index.ts',
      name: 'LowCodeCore',
      fileName: 'lowcode-core',
    },

    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external(id: string) {
        return Object.keys(pkg.dependencies).some(k => new RegExp(`^${k}`).test(id));
      },
    },
  },
});
