import registerPromiseWorker from 'promise-worker/register';
import { FigmaParser } from './parser/core';

const parser = new FigmaParser();
registerPromiseWorker((info: any) => {
  if (info.type === 'parse') {
    const msg = typeof info.message === 'string' ? JSON.parse(info.message) : info.message;
    try {
      const data = parser.parse(msg);
      return Promise.resolve({
        code: 200,
        message: 'success',
        data,
      });
    }
    catch (error: any) {
      return Promise.reject(error);
    }
  }
});
