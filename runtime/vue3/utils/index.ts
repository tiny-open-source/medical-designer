import type { MApp } from '@lowcode/schema';

export function getLocalConfig(): MApp[] {
  const configStr = localStorage.getItem('lowcodeDSL');
  if (!configStr)
    return [];
  try {
    // eslint-disable-next-line no-eval
    return [eval(`(${configStr})`)];
  }
  catch {
    return [];
  }
}
