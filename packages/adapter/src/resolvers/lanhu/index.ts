import PromiseWorker from 'promise-worker';
import { FigmaParser } from './parser/core';
import FigmaParseWorker from './worker?worker';

const figmaParseWorker = new FigmaParseWorker();
const promiseFigmaParserWorker = new PromiseWorker(figmaParseWorker);
function parse(code: string) {
  return promiseFigmaParserWorker.postMessage({
    type: 'parse',
    message: code,
  });
}

export {
  FigmaParser,
  parse,
};
