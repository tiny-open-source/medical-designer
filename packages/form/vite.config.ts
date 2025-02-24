import path from 'node:path';
import process from 'node:process';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { defineConfig } from 'vite';
import pkg from './package.json';

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
  ],
  resolve: {
    alias:
      process.env.NODE_ENV === 'production'
        ? []
        : [{ find: /@lowcode\/(.*)/, replacement: path.join(__dirname, '../$1/src') }],
  },
  build: {
    cssCodeSplit: false,
    sourcemap: true,
    minify: false,
    target: 'esnext',

    lib: {
      entry: 'src/index.ts',
      name: 'LowCodeForm',
      fileName: 'lowcode-form',
    },

    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external(id: string) {
        return (
          id.startsWith('vue')
          || id.startsWith('naive-ui')
          || /^@lowcode\//.test(id)
          || Object.keys(pkg.dependencies).some(k => new RegExp(`^${k}`).test(id))
        );
      },

      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          'vue': 'Vue',
          'naive-ui': 'NaiveUi',
        },
      },
    },
  },
});
