import type { UserConfig, UserConfigLoader } from '../types';

export function isPlainObject<T extends Record<any, any> = Record<any, any>>(val: unknown): val is T {
  return Object.prototype.toString.call(val) === '[object Object]';
}

/**
 * Check if a module is esm with `export default`
 */
export function hasExportDefault<T = any>(mod: unknown): mod is { default: T } {
  return isPlainObject(mod) && !!mod.__esModule && Object.prototype.hasOwnProperty.call(mod, 'default');
}

export const loadUserConfigCjs: UserConfigLoader = async (userConfigPath) => {
  const required = require(userConfigPath);
  return hasExportDefault(required) ? required.default : required;
};

const loaderMap: [RegExp, UserConfigLoader][] = [[/\.(js|cjs|ts)$/, loadUserConfigCjs]];

export async function loadUserConfig(userConfigPath?: string): Promise<Partial<UserConfig>> {
  if (!userConfigPath)
    return {};

  for (const [condition, loader] of loaderMap) {
    if (condition.test(userConfigPath)) {
      return loader(userConfigPath);
    }
  }

  return {};
}
