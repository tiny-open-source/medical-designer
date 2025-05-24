import type Core from '@low-code/core';

import type { Id, MApp, MContainer, MNode } from '@low-code/schema';
import type { MoveableOptions } from 'moveable';

import type { GuidesType } from './const';
import type StageCore from './StageCore';
import type StageDragResize from './StageDragResize';
import type StageMask from './StageMask';

export type CanSelect = (el: HTMLElement, event: MouseEvent, stop: () => boolean) => boolean | Promise<boolean>;
export type IsContainer = (el: HTMLElement) => boolean | Promise<boolean>;

export interface StageCoreConfig {
  /** 需要对齐的dom节点的CSS选择器字符串 */
  snapElementQuerySelector?: string;
  /** 放大倍数，默认1倍 */
  zoom?: number;
  canSelect?: CanSelect;
  isContainer: IsContainer;
  containerHighlightClassName?: string;
  containerHighlightDuration?: number;
  containerHighlightType?: ContainerHighlightType;
  moveableOptions?: ((core?: StageCore) => MoveableOptions) | MoveableOptions;
  multiMoveableOptions?: ((core?: StageCore) => MoveableOptions) | MoveableOptions;

  /** runtime 的HTML地址，可以是一个HTTP地址，如果和编辑器不同域，需要设置跨域，也可以是一个相对或绝对路径 */
  runtimeUrl?: string;
  render?: (stage: StageCore) => HTMLDivElement | void | Promise<HTMLDivElement | void>;
  autoScrollIntoView?: boolean;
  updateDragEl?: (el: HTMLDivElement, target: HTMLElement) => void;
}

export enum ContainerHighlightType {
  DEFAULT = 'default',
  ALT = 'alt',
}

export interface StageRenderConfig {
  core: StageCore;
}

/** 拖动状态 */
export enum StageDragStatus {
  /** 开始拖动 */
  START = 'start',
  /** 拖动中 */
  ING = 'ing',
  /** 拖动结束 */
  END = 'end',
}
export interface StageMaskConfig {
  core: StageCore;
}

export interface StageDragResizeConfig {
  core: StageCore;
  container: HTMLElement;
  mask: StageMask;
}

export type Rect = {
  width: number;
  height: number;
} & Offset;

export interface Offset {
  left: number;
  top: number;
}

export interface GuidesEventData {
  type: GuidesType;
  guides: number[];
}

export interface UpdateEventData {
  data: {
    el: HTMLElement;
    style: {
      width?: number;
      height?: number;
      left?: number;
      top?: number;
      transform?: {
        rotate?: string;
        scale?: string;
      };
    };
    ghostEl?: HTMLElement;
  }[];
  parentEl: HTMLElement | null;
}

export interface SortEventData {
  src: Id;
  dist: Id;
  root?: MApp;
}

export interface UpdateData {
  config: MNode;
  parent?: MContainer;
  parentId?: Id;
  root: MApp;
}

export interface RemoveData {
  id: Id;
  parentId: Id;
  root: MApp;
}

export interface Runtime {
  getApp?: () => Core;
  beforeSelect?: (el: HTMLElement) => Promise<boolean> | boolean;
  updateRootConfig?: (config: MApp) => void;
  updatePageId?: (id: Id) => void;
  select?: (id: Id) => Promise<HTMLElement> | HTMLElement;
  add?: (data: UpdateData) => void;
  update?: (data: UpdateData) => void;
  sortNode?: (data: SortEventData) => void;
  remove?: (data: RemoveData) => void;
}

export interface LowCode {
  /** 当前页面的根节点变化时调用该方法，编辑器会同步该el和stage的大小，该方法由stage注入到iframe.contentWindow中 */
  onPageElUpdate: (el: HTMLElement) => void;

  onRuntimeReady: (runtime: Runtime) => void;
}

export interface RuntimeWindow extends Window {
  'low-code': LowCode;
}

export interface StageHighlightConfig {
  core: StageCore;
  container: HTMLElement;
}

export interface TargetCalibrateConfig {
  parent: HTMLElement;
  mask: StageMask;
  dr: StageDragResize;
  core: StageCore;
}
