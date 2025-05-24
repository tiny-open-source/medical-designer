import path from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { defineConfig } from 'vite';
// https://vite.dev/config/
export default defineConfig({
  base: '/low-code-platform/playground/runtime/vue3',
  publicDir: 'public',
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: [
      { find: '@', replacement: fileURLToPath(new URL('src', import.meta.url)) },
      { find: /^@low-code\/core\/resetcss.css/, replacement: path.join(__dirname, '../../packages/core/resetcss.css') },
      { find: /@low-code\/(.*)/, replacement: path.join(__dirname, '../../packages/$1/src') },
    ],
  },
  server: {
    port: 10002,
    hmr: {
      port: 10002,
    },
  },
  logLevel: 'error',
  build: {
    sourcemap: true,
    cssCodeSplit: false,
    rollupOptions: {
      input: {
        page: './page/index.html',
        playground: './playground/index.html',
      },

      output: {
        entryFileNames: 'assets/[name].js',
      },
    },
  },
});
