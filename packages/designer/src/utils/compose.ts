export function compose(middleware: ((params?: any) => any)[], isAsync: boolean) {
  if (!Array.isArray(middleware))
    throw new TypeError('Middleware 必须是一个数组!');
  for (const fn of middleware) {
    if (typeof fn !== 'function')
      throw new TypeError('Middleware 必须由函数组成!');
  }

  /**
   * @param {object} args
   * @return {Promise}
   * @api public
   */
  return (args: any[], next?: () => any) => {
    // last called middleware #
    let index = -1;
    return dispatch(0);
    function dispatch(i: number): Promise<void> | void {
      if (i <= index) {
        const error = new Error('next() 被多次调用');
        if (isAsync) {
          return Promise.reject(error);
        }
        throw error;
      }
      index = i;
      let fn = middleware[i];
      if (i === middleware.length && next)
        fn = next;
      if (!fn) {
        if (isAsync) {
          return Promise.resolve();
        }
        return;
      }

      if (isAsync) {
        try {
          return Promise.resolve(fn(...args, dispatch.bind(null, i + 1)));
        }
        catch (err) {
          return Promise.reject(err);
        }
      }
      return fn(...args, dispatch.bind(null, i + 1));
    }
  };
}
