import PromiseWorker from 'promise-worker';
import FigmaParseWorker from './worker?worker';

const figmaParseWorker = new FigmaParseWorker();
const promiseFigmaParserWorker = new PromiseWorker(figmaParseWorker);
function figmaParser(code: string) {
  return promiseFigmaParserWorker.postMessage({
    type: 'parse',
    message: code,
  });
}

export {
  figmaParser,
};
