import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
  ],
  build: {
    sourcemap: true,

    lib: {
      entry: 'src/index.ts',
      name: 'LowCodeSchema',
      fileName: 'lowcode-schema',
    },
  },
});
