const mode = import.meta.env.MODE;
function createLogger(logger: (...args: any[]) => void) {
  return function log(...args: any[]) {
    if (mode === 'development') {
      logger(...args);
    }
  };
}
export const log = createLogger((...args: any[]) => {
  console.log('lowcode-designer: ', ...args);
});

export const info = createLogger((...args: any[]) => {
  console.info('lowcode-designer: ', ...args);
});

export const warn = createLogger((...args: any[]) => {
  console.warn('lowcode-designer: ', ...args);
});

export const debug = createLogger((...args: any[]) => {
  console.debug('lowcode-designer: ', ...args);
});

export const error = createLogger((...args: any[]) => {
  console.error('lowcode-designer: ', ...args);
});
