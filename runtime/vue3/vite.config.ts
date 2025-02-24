import path from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import externalGlobals from 'rollup-plugin-external-globals';
import { defineConfig } from 'vite';
// https://vite.dev/config/
export default defineConfig({
  base: '/low-code-platform/playground/runtime/vue3',
  plugins: [vue(), vueJsx(), externalGlobals({ vue: 'Vue' }, { exclude: ['page.html', 'playground.html'] }),
  ],
  resolve: {
    alias: [
      { find: '@', replacement: fileURLToPath(new URL('src', import.meta.url)) },
      { find: /@lowcode\/(.*)/, replacement: path.join(__dirname, '../../packages/$1/src') },
    ],
  },
  server: {
    port: 10002,
    hmr: {
      port: 10002,
    },
    fs: {
      // 允许访问工作区上层目录
      allow: ['..'],
    },
  },
  logLevel: 'error',
  build: {
    sourcemap: true,
    cssCodeSplit: false,
    rollupOptions: {
      input: {
        page: './page.html',
        playground: './playground.html',
        components: './src/comp-entry.ts',
        config: './src/config-entry.ts',
        value: './src/value-entry.ts',
        event: './src/event-entry.ts',
      },

      output: {
        entryFileNames: 'assets/[name].js',
        // fix： 为了避免出现下划线开头文件，导致gh-page部分文件无法访问
        chunkFileNames: 'assets/lowcode_[name].js',
      },
    },
  },
});
