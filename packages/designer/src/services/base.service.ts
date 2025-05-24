import { EventEmitter } from 'eventemitter3';

import { compose } from '../utils/compose';

const methodName = (prefix: string, name: string) => `${prefix}${name[0].toUpperCase()}${name.substring(1)}`;

const isError = (error: any): boolean => Object.prototype.toString.call(error) === '[object Error]';

function doAction(args: any[], scope: any, sourceMethod: any, beforeMethodName: string, afterMethodName: string, fn: (args: any[], next?: (params?: any) => any | undefined) => void) {
  let beforeArgs = args;

  for (const beforeMethod of scope.pluginOptionsList[beforeMethodName]) {
    beforeArgs = beforeMethod(...beforeArgs) || [];

    if (isError(beforeArgs))
      throw beforeArgs;

    if (!Array.isArray(beforeArgs)) {
      beforeArgs = [beforeArgs];
    }
  }

  let returnValue: any = fn(beforeArgs, sourceMethod.bind(scope));

  for (const afterMethod of scope.pluginOptionsList[afterMethodName]) {
    returnValue = afterMethod(returnValue, ...beforeArgs);

    if (isError(returnValue))
      throw returnValue;
  }

  return returnValue;
}

async function doAsyncAction(args: any[], scope: any, sourceMethod: any, beforeMethodName: string, afterMethodName: string, fn: (args: any[], next?: (params?: any) => any | undefined) => Promise<void> | void) {
  let beforeArgs = args;

  for (const beforeMethod of scope.pluginOptionsList[beforeMethodName]) {
    beforeArgs = (await beforeMethod(...beforeArgs)) || [];

    if (isError(beforeArgs))
      throw beforeArgs;

    if (!Array.isArray(beforeArgs)) {
      beforeArgs = [beforeArgs];
    }
  }

  let returnValue: any = await fn(beforeArgs, sourceMethod.bind(scope));

  for (const afterMethod of scope.pluginOptionsList[afterMethodName]) {
    returnValue = await afterMethod(returnValue, ...beforeArgs);

    if (isError(returnValue))
      throw returnValue;
  }

  return returnValue;
}

/**
 * 提供两种方式对Class进行扩展
 * 方法1：
 * 给Class中的每个方法都添加before after两个钩子
 * 给Class添加一个usePlugin方法，use方法可以传入一个包含before或者after方法的对象
 *
 * 例如：
 *   Class EditorService extends BaseService {
 *     constructor() {
 *       super([ { name: 'add', isAsync: true },]);
 *     }
 *     add(value) { return result; }
 *   };
 *
 *   const editorService = new EditorService();
 *
 *   editorService.usePlugin({
 *     beforeAdd(value) { return [value] },
 *     afterAdd(result, value) { return result },
 *   });
 *
 *   editorService.add(); 最终会变成  () => {
 *    editorService.beforeAdd();
 *    editorService.add();
 *    editorService.afterAdd();
 *   }
 *
 * 调用时的参数会透传到before方法的参数中, 然后before的return 会作为原方法的参数和after的参数，after第一个参数则是原方法的return值;
 * 如需终止后续方法调用可以return new Error();
 *
 * 方法2：
 * 给Class中的每个方法都添加中间件
 * 给Class添加一个use方法，use方法可以传入一个包含源对象方法名作为key值的对象
 *
 * 例如：
 *   Class EditorService extends BaseService {
 *     constructor() {
 *       super([ { name: 'add', isAsync: true },]);
 *     }
 *     add(value) { return result; }
 *   };
 *
 *  const editorService = new EditorService();
 *  editorService.use({
 *    add(value, next) { console.log(value); next() },
 *  });
 */
export default class extends EventEmitter {
  private pluginOptionsList: Record<string, ((params?: any) => any)[]> = {};
  private middleware: Record<string, ((params?: any) => any)[]> = {};
  private taskList: (() => Promise<void>)[] = [];
  private doingTask = false;

  constructor(methods: { name: string; isAsync: boolean }[] = [], serialMethods: string[] = []) {
    super();

    methods.forEach(({ name: propertyName, isAsync }) => {
      const scope = this as any;

      const sourceMethod = scope[propertyName];

      const beforeMethodName = methodName('before', propertyName);
      const afterMethodName = methodName('after', propertyName);

      this.pluginOptionsList[beforeMethodName] = [];
      this.pluginOptionsList[afterMethodName] = [];
      this.middleware[propertyName] = [];

      const fn = compose(this.middleware[propertyName], isAsync);
      Object.defineProperty(scope, propertyName, {
        value: isAsync
          ? async (...args: any[]) => {
            if (!serialMethods.includes(propertyName)) {
              return doAsyncAction(args, scope, sourceMethod, beforeMethodName, afterMethodName, fn);
            }

            // 由于async await，所以会出现函数执行到await时让出线程，导致执行顺序出错，例如调用了select(1) -> update -> select(2)，这个时候就有可能出现update了2；
            // 这里保证函数调用严格按顺序执行；
            const promise = new Promise<any>((resolve, reject) => {
              this.taskList.push(async () => {
                try {
                  const value = await doAsyncAction(args, scope, sourceMethod, beforeMethodName, afterMethodName, fn);
                  resolve(value);
                }
                catch (e) {
                  reject(e);
                }
              });
            });

            if (!this.doingTask) {
              this.doTask();
            }

            return promise;
          }
          : (...args: any[]) => doAction(args, scope, sourceMethod, beforeMethodName, afterMethodName, fn),
      });
    });
  }

  /**
   * @deprecated 请使用usePlugin代替
   */
  public use(options: Record<string, (params?: any) => any>) {
    Object.entries(options).forEach(([methodName, method]: [string, (params?: any) => any]) => {
      if (typeof method === 'function')
        this.middleware[methodName].push(method);
    });
  }

  public usePlugin(options: Record<string, (params?: any) => any>) {
    Object.entries(options).forEach(([methodName, method]: [string, (params?: any) => any]) => {
      if (typeof method === 'function')
        this.pluginOptionsList[methodName].push(method);
    });
  }

  public removeAllPlugins() {
    Object.keys(this.pluginOptionsList).forEach((key) => {
      this.pluginOptionsList[key] = [];
    });
    Object.keys(this.middleware).forEach((key) => {
      this.middleware[key] = [];
    });
  }

  private async doTask() {
    this.doingTask = true;
    let task = this.taskList.shift();
    while (task) {
      await task();
      task = this.taskList.shift();
    }
    this.doingTask = false;
  }
}
