import path from 'node:path';

import { defineConfig } from '@low-code/cli';

export default defineConfig({
  packages: [path.join(__dirname, '../../packages/runtime-ui')],
  componentFileAffix: '.vue',
});
