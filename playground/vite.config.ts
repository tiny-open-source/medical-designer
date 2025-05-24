import type { Plugin } from 'vite';
import path from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import UnoCSS from 'unocss/vite';
import AutoImport from 'unplugin-auto-import/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';
import vueDevTools from 'vite-plugin-vue-devtools';

// https://vite.dev/config/
export default defineConfig({
  base: '/low-code-platform/playground/',
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
  plugins: [vue(), vueJsx(), vueDevTools(), UnoCSS(), AutoImport({
    dts: true,
    imports: [
      'vue',
      '@vueuse/core',
    ],
    viteOptimizeDeps: true,
  }) as Plugin, Components({
    resolvers: [AntDesignVueResolver()],
  }) as Plugin],
  resolve: {
    alias: [
      { find: '@', replacement: fileURLToPath(new URL('src', import.meta.url)) },
      { find: /@low-code\/(.*)/, replacement: path.join(__dirname, '../packages/$1/src') },
    ],
  },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis',
      },
    },
  },
  preview: {
    proxy: {},
  },
  server: {
    port: 10001,
    open: '/low-code-platform/playground/',
    proxy: {
      '^/low-code-platform/playground/runtime/vue3': {
        target: 'http://localhost:10002',
        changeOrigin: true,
        prependPath: false,
      },
    },
  },
});
