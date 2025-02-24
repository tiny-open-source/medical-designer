import { transformSync } from 'esbuild';
import fs from 'fs-extra';

/**
 * Transform a ts file to cjs code
 */
export function transformTsFileToCodeSync(filename: string): string {
  return transformSync(fs.readFileSync(filename).toString(), {
    format: 'cjs',
    loader: 'ts',
    sourcefile: filename,
    sourcemap: 'inline',
    target: 'node14',
  }).code;
}

/**
 * Globally allow ts files to be loaded via `require()`
 */
export function allowTs(): void {
  // eslint-disable-next-line node/no-deprecated-api
  require.extensions['.ts'] = (m: any, filename) => {
    m._compile(transformTsFileToCodeSync(filename), filename);
  };
}
