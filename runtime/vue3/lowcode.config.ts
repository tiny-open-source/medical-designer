import path from 'node:path';

import { defineConfig } from '@lowcode/cli';

export default defineConfig({
  packages: [path.join(__dirname, '../../packages/runtime-ui')],
  componentFileAffix: '.vue',
});
