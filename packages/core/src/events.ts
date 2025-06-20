/**
 * 通用的事件处理
 */

import type App from './App';
import type Node from './Node';

export interface EventOption {
  label: string;
  value: string;
}

const COMMON_EVENT_PREFIX = 'low-code:common:events:';
const COMMON_METHOD_PREFIX = 'low-code:common:actions:';

const CommonMethod = {
  SHOW: 'show',
  HIDE: 'hide',
  SCROLL_TO_VIEW: 'scrollIntoView',
  SCROLL_TO_TOP: 'scrollToTop',
};

export const DEFAULT_EVENTS: EventOption[] = [{ label: '点击', value: `${COMMON_EVENT_PREFIX}click` }];

export const DEFAULT_METHODS: EventOption[] = [];

export function getCommonEventName(commonEventName: string, nodeId: string | number) {
  const returnName = `${commonEventName}:${nodeId}`;

  if (commonEventName.startsWith(COMMON_EVENT_PREFIX))
    return returnName;

  return `${COMMON_EVENT_PREFIX}${returnName}`;
}

export const isCommonMethod = (methodName: string) => methodName.startsWith(COMMON_METHOD_PREFIX);

// 点击在组件内的某个元素上，需要向上寻找到当前组件
function getDirectComponent(element: HTMLElement | null, app: App): Node | boolean {
  if (!element) {
    return false;
  }

  if (!element.id) {
    return getDirectComponent(element.parentElement, app);
  }

  const node = app.page?.getNode(element.id);
  if (!node) {
    return false;
  }

  return node;
}

function commonClickEventHandler(app: App, eventName: string, e: any) {
  const node = getDirectComponent(e.target, app);

  if (node) {
    const { instance, data } = node as Node;
    app.emit(getCommonEventName(eventName, data.id), instance);
  }
}

export function bindCommonEventListener(app: App) {
  window.document.body.addEventListener('click', (e: any) => {
    commonClickEventHandler(app, 'click', e);
  });

  window.document.body.addEventListener(
    'click',
    (e: any) => {
      commonClickEventHandler(app, 'click:capture', e);
    },
    true,
  );
}
export function triggerCommonMethod(methodName: string, node: Node) {
  const { instance } = node;

  switch (methodName.replace(COMMON_METHOD_PREFIX, '')) {
    case CommonMethod.SHOW:
      instance.show();
      break;

    case CommonMethod.HIDE:
      instance.hide();
      break;

    case CommonMethod.SCROLL_TO_VIEW:
      instance.$el.scrollIntoView({ behavior: 'smooth' });
      break;

    case CommonMethod.SCROLL_TO_TOP:
      window.scrollTo({ top: 0, behavior: 'smooth' });
      break;

    default:
      break;
  }
}
