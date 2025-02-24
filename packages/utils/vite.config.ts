import path from 'node:path';
import { defineConfig } from 'vite';
import pkg from './package.json';

const deps = Object.keys(pkg.dependencies);
export default defineConfig({
  plugins: [
  ],
  resolve: {
    alias: [
      { find: /@lowcode\/(.*)/, replacement: path.join(__dirname, '../../packages/$1/src') },
    ],
  },
  build: {
    sourcemap: true,

    lib: {
      entry: 'src/index.ts',
      name: 'LowCodeUtils',
      fileName: 'lowcode-utils',
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external(id: string) {
        return deps.some(k => new RegExp(`^${k}`).test(id));
      },
    },
  },
});
