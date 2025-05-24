import type { Id, MApp, MComponent, MContainer, MNode, MPage } from '@low-code/schema';
import type StageCore from '@low-code/stage';
import type { DesignerNodeInfo } from '../type';
import { NodeType } from '@low-code/schema';

import { getNodePath, isNumber, isPage, isPop } from '@low-code/utils';
import { Layout } from '../type';

export const COPY_STORAGE_KEY = '$LowCodeDesignerCopyData';

/**
 * 获取所有页面配置
 * @param app DSL跟节点
 * @returns 所有页面配置
 */
export function getPageList(app: MApp): MPage[] {
  if (app.items && Array.isArray(app.items)) {
    return app.items.filter((item: MPage) => item.type === NodeType.PAGE);
  }
  return [];
}

/**
 * 获取所有页面名称
 * @param pages 所有页面配置
 * @returns 所有页面名称
 */
export const getPageNameList = (pages: MPage[]): string[] => pages.map((page: MPage) => page.name || 'index');

/**
 * 新增页面时，生成页面名称
 * @param {object} pageNameList 所有页面名称
 * @returns {string}
 */
export function generatePageName(pageNameList: string[]): string {
  let pageLength = pageNameList.length;

  if (!pageLength)
    return 'index';

  let pageName = `page_${pageLength}`;
  while (pageNameList.includes(pageName)) {
    pageLength += 1;
    pageName = `page_${pageLength}`;
  }

  return pageName;
}

/**
 * 新增页面时，生成页面名称
 * @param {object} app 所有页面配置
 * @returns {string}
 */
export const generatePageNameByApp = (app: MApp): string => generatePageName(getPageNameList(getPageList(app)));

/**
 * @param {object} node
 * @returns {boolean}
 */
export const isFixed = (node: MNode): boolean => node.style?.position === 'fixed';

export function getNodeIndex(id: Id, parent: MContainer | MApp): number {
  const items = parent?.items || [];
  return items.findIndex((item: MNode) => `${item.id}` === `${id}`);
}

export function getRelativeStyle(style: Record<string, any> = {}): Record<string, any> {
  return {
    ...style,
    position: 'relative',
    top: 0,
    left: 0,
  };
}

function getMiddleTop(node: MNode, parentNode: MNode, stage: StageCore | null) {
  let height = node.style?.height || 0;

  if (!stage || typeof node.style?.top !== 'undefined' || !parentNode.style)
    return node.style?.top;

  if (!isNumber(height)) {
    height = 0;
  }

  const { height: parentHeight } = parentNode.style;

  if (isPage(parentNode)) {
    const { scrollTop = 0, wrapperHeight } = stage.mask;
    return (wrapperHeight - height) / 2 + scrollTop;
  }

  return (parentHeight - height) / 2;
}

export function getInitPositionStyle(style: Record<string, any> = {}, layout: Layout) {
  if (layout === Layout.ABSOLUTE) {
    return {
      ...style,
      position: 'absolute',
    };
  }

  if (layout === Layout.RELATIVE) {
    return getRelativeStyle(style);
  }

  return style;
}

export function setLayout(node: MNode, layout: Layout) {
  node.items?.forEach((child: MNode) => {
    if (isPop(child))
      return;

    const style = child.style || {};

    // 是 fixed 不做处理
    if (style.position === 'fixed')
      return;

    if (layout !== Layout.RELATIVE) {
      style.position = 'absolute';
    }
    else {
      child.style = getRelativeStyle(style);
      child.style.right = 'auto';
      child.style.bottom = 'auto';
    }
  });
  return node;
}

export function change2Fixed(node: MNode, root: MApp) {
  const path = getNodePath(node.id, root.items);
  const offset = {
    left: 0,
    top: 0,
  };

  path.forEach((value) => {
    offset.left = offset.left + Number.parseFloat(value.style?.left || 0);
    offset.top = offset.top + Number.parseFloat(value.style?.top || 0);
  });

  return {
    ...(node.style || {}),
    ...offset,
  };
}

export async function Fixed2Other(node: MNode, root: MApp, getLayout: (parent: MNode, node?: MNode) => Promise<Layout>) {
  const path = getNodePath(node.id, root.items);
  const cur = path.pop();
  const offset = {
    left: cur?.style?.left || 0,
    top: cur?.style?.top || 0,
    right: '',
    bottom: '',
  };

  path.forEach((value) => {
    offset.left = offset.left - Number.parseFloat(value.style?.left || 0);
    offset.top = offset.top - Number.parseFloat(value.style?.top || 0);
  });
  const style = node.style || {};

  const parent = path.pop();
  if (!parent) {
    return getRelativeStyle(style);
  }

  const layout = await getLayout(parent);
  if (layout !== Layout.RELATIVE) {
    return {
      ...style,
      ...offset,
      position: 'absolute',
    };
  }

  return getRelativeStyle(style);
}

export function getGuideLineFromCache(key: string): number[] {
  if (!key)
    return [];

  const guideLineCacheData = globalThis.localStorage.getItem(key);
  if (guideLineCacheData) {
    try {
      return JSON.parse(guideLineCacheData) || [];
    }
    catch (e) {
      console.error(e);
    }
  }

  return [];
}

export function fixNodeLeft(config: MNode, parent: MContainer, doc?: Document) {
  if (!doc || !config.style || !isNumber(config.style.left))
    return config.style?.left;

  const el = doc.getElementById(`${config.id}`);
  const parentEl = doc.getElementById(`${parent.id}`);

  const left = Number(config.style?.left) || 0;
  if (el && parentEl && el.offsetWidth + left > parentEl.offsetWidth) {
    return parentEl.offsetWidth - el.offsetWidth;
  }

  return config.style.left;
}

export function fixNodePosition(config: MNode, parent: MContainer, stage: StageCore | null) {
  if (config.style?.position !== 'absolute') {
    return config.style;
  }

  return {
    ...(config.style || {}),
    top: getMiddleTop(config, parent, stage),
    left: fixNodeLeft(config, parent, stage?.renderer.contentWindow?.document),
  };
}
export function getNodeInfo(id: Id, root: Pick<MApp, 'id' | 'items'> | null) {
  const info: DesignerNodeInfo = {
    node: null,
    parent: null,
    page: null,
  };

  if (!root)
    return info;

  if (id === root.id) {
    info.node = root;
    return info;
  }

  const path = getNodePath(id, root.items);

  if (!path.length)
    return info;

  path.unshift(root);

  info.node = path[path.length - 1] as MComponent;
  info.parent = path[path.length - 2] as MContainer;

  path.forEach((item) => {
    if (isPage(item)) {
      info.page = item as MPage;
    }
  });

  return info;
}
