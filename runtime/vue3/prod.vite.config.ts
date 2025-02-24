import path from 'node:path';

import process from 'node:process';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import externalGlobals from 'rollup-plugin-external-globals';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
  if (['value', 'config', 'event'].includes(mode)) {
    const capitalToken = mode.charAt(0).toUpperCase() + mode.slice(1);
    return {
      build: {
        publicDir: './.lowcode/public',
        cssCodeSplit: false,
        sourcemap: true,
        minify: false,
        target: 'esnext',
        outDir: `../../playground/public/entry/vue3/${mode}`,

        lib: {
          entry: `.lowcode/${mode}-entry.ts`,
          name: `lowcodePreset${capitalToken}s`,
          fileName: format => `index.${format}.js`,
          formats: ['umd'],
        },
      },
    };
  }

  if (['page', 'playground'].includes(mode)) {
    const base = `/low-code-platform/playground/runtime/vue3/${mode}`;
    const outDir = path.resolve(process.cwd(), `../../playground/public/runtime/vue3/${mode}`);
    return {
      plugins: [
        vue(),
        vueJsx(),
        externalGlobals({ vue: 'Vue' }, { exclude: [`./${mode}/index.html`] }),
      ],

      root: `./${mode}/`,

      publicDir: '../public',
      base,

      build: {
        publicDir: './.tmagic/public',
        emptyOutDir: true,
        sourcemap: true,
        outDir,
      },
    };
  }

  return {};
});
