import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import alias from '@rollup/plugin-alias';
import dts from 'rollup-plugin-dts';

if (!existsSync('temp')) {
  console.warn(
    'no temp dts files found. run `tsc -p tsconfig.build-browser.json && vue-tsc --declaration --emitDeclarationOnly --project tsconfig.build-vue.json` first.',
  );
  process.exit(1);
}

removeScss('temp/designer/src/index.d.ts');
removeScss('temp/form/src/index.d.ts');

const packages = readdirSync('temp');
const targets = process.env.TARGETS ? process.env.TARGETS.split(',') : null;
const targetPackages = targets ? packages.filter(pkg => targets.includes(pkg)) : packages;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function rollupConfig(pkg, base) {
  return {
    input: `./temp/${pkg}/src/index.d.ts`,
    output: {
      file: `${base}/${pkg}/types/index.d.ts`,
      format: 'es',
    },
    plugins: [
      alias({
        entries: [
          { find: /^@form/, replacement: path.join(__dirname, `./temp/form/src`) },
          { find: /^@designer/, replacement: path.join(__dirname, `./temp/designer/src`) },
        ],
      }),
      dts(),
    ],
    onwarn(warning, warn) {
      // during dts rollup, everything is externalized by default
      if (warning.code === 'UNRESOLVED_IMPORT' && !warning.exporter?.startsWith('.')) {
        return;
      }
      warn(warning);
    },
  };
}

export default [
  ...targetPackages.map(pkg => rollupConfig(pkg, 'packages')),
];

function removeScss(path) {
  writeFileSync(path, readFileSync(path).toString().replace(`import './theme/index.scss';`, ''));
}
