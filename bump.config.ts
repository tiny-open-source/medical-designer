// bump.config.ts
import { defineConfig } from 'nbump';

export default defineConfig({
  leading: ['git pull --rebase', 'pnpm i'],
  trailing: [],
  publish: false,
  changelog: true,
  mode: 'monorepo',
  allowedBranches: ['main'],
  packages: ['packages/**', 'playground/*', 'runtime/**'],
}) as any;
