import type { MNode } from '@lowcode/schema';
import { NodeType } from '@lowcode/schema';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { set as objectSet } from 'lodash-es';

dayjs.extend(utc);
export * from './dom';

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      clearTimeout(timer);
      resolve();
    }, ms);
  });
}

export function datetimeFormatter(v: string | Date, defaultValue = '-', format = 'YYYY-MM-DD HH:mm:ss'): any {
  if (v) {
    let time = null;
    if (['x', 'timestamp'].includes(format)) {
      time = dayjs(v).valueOf();
    }
    else if ((typeof v === 'string' && v.includes('Z')) || v.constructor === Date) {
      // UTC字符串时间或Date对象格式化为北京时间
      time = dayjs(v).utcOffset(8).format(format);
    }
    else {
      time = dayjs(v).format(format);
    }

    // 格式化为北京时间
    if (time !== 'Invalid Date') {
      return time;
    }
    return defaultValue;
  }
  return defaultValue;
}

export const asyncLoadJs = (() => {
  // 正在加载或加载成功的存入此Map中
  const documentMap = new Map();

  return (url: string, crossOrigin?: string, document = globalThis.document) => {
    let loaded = documentMap.get(document);
    if (!loaded) {
      loaded = new Map();
      documentMap.set(document, loaded);
    }

    // 正在加载或已经加载成功的，直接返回
    if (loaded.get(url))
      return loaded.get(url);

    const load = new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.type = 'module';
      if (crossOrigin) {
        script.crossOrigin = crossOrigin;
      }
      script.src = url;
      document.body.appendChild(script);
      script.onload = () => {
        resolve();
      };
      script.onerror = () => {
        reject(new Error('加载失败'));
      };
      setTimeout(() => {
        reject(new Error('timeout'));
      }, 60 * 1000);
    }).catch((err) => {
      // 加载失败的，从map中移除，第二次加载时，可以再次执行加载
      loaded.delete(url);
      throw err;
    });

    loaded.set(url, load);
    return loaded.get(url);
  };
})();

export const asyncLoadCss = (() => {
  // 正在加载或加载成功的存入此Map中
  const documentMap = new Map();

  return (url: string, document = globalThis.document) => {
    let loaded = documentMap.get(document);
    if (!loaded) {
      loaded = new Map();
      documentMap.set(document, loaded);
    }

    // 正在加载或已经加载成功的，直接返回
    if (loaded.get(url))
      return loaded.get(url);

    const load = new Promise<void>((resolve, reject) => {
      const node = document.createElement('link');
      node.rel = 'stylesheet';
      node.href = url;
      document.head.appendChild(node);
      node.onload = () => {
        resolve();
      };
      node.onerror = () => {
        reject(new Error('加载失败'));
      };
      setTimeout(() => {
        reject(new Error('timeout'));
      }, 60 * 1000);
    }).catch((err) => {
      // 加载失败的，从map中移除，第二次加载时，可以再次执行加载
      loaded.delete(url);
      throw err;
    });

    loaded.set(url, load);
    return loaded.get(url);
  };
})();

// 驼峰转换横线
export const toLine = (name = '') => name.replace(/\B([A-Z])/g, '-$1').toLowerCase();

export const toHump = (name = ''): string => name.replace(/-(\w)/g, (all, letter) => letter.toUpperCase());

export const emptyFn = (): any => undefined;

/**
 * 通过id获取组件在应用的子孙路径
 * @param {number | string} id 组件id
 * @param {Array} data 要查找的根容器节点
 * @return {Array} 组件在data中的子孙路径
 */
export function getNodePath(id: number | string, data: MNode[] = []): MNode[] {
  const path: MNode[] = [];

  const get = function (id: number | string, data: MNode[]): MNode | null {
    if (!Array.isArray(data)) {
      return null;
    }

    for (let i = 0, l = data.length; i < l; i++) {
      const item: any = data[i];

      path.push(item);
      if (`${item.id}` === `${id}`) {
        return item;
      }

      if (item.items) {
        const node = get(id, item.items);
        if (node) {
          return node;
        }
      }

      path.pop();
    }

    return null;
  };

  get(id, data);

  return path;
}

export function filterXSS(str: string) {
  return str.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

export function getUrlParam(param: string, url?: string) {
  const u = url || location.href;
  const reg = new RegExp(`[?&#]${param}=([^&#]+)`, 'gi');

  const matches = u.match(reg);
  let strArr;
  if (matches && matches.length > 0) {
    strArr = matches[matches.length - 1].split('=');
    if (strArr && strArr.length > 1) {
      // 过滤XSS字符
      return filterXSS(strArr[1]);
    }
    return '';
  }
  return '';
}

export const isPop = (node: MNode): boolean => Boolean(node.type?.toLowerCase().endsWith('pop'));

export function isPage(node: MNode | undefined | null): boolean {
  if (!node)
    return false;
  return Boolean(node.type?.toLowerCase() === NodeType.PAGE);
}
export const isNumber = (value: string) => /^-?\d+(?:\.\d+)?$/.test(value);
export const getHost = (targetUrl: string) => targetUrl.match(/\/\/([^/]+)/)?.[1];

export function isSameDomain(targetUrl = '', source = globalThis.location.host) {
  const isHttpUrl = /^https?:\/\//.test(targetUrl);

  if (!isHttpUrl)
    return true;

  return getHost(targetUrl) === source;
}
export function setValueByKeyPath(keys: string | number, value: any, data: Record<string | number, any> = {}): any {
  return objectSet(data, keys, value);
}
