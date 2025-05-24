import type { FormConfig } from '@low-code/form';
import type { Id, MApp, MContainer, MNode, MPage } from '@low-code/schema';
import type StageCore from '@low-code/stage';
import type { ContainerHighlightType, MoveableOptions } from '@low-code/stage';
import type { Component } from 'vue';
import type { ComponentListService } from './services/component-list.service';
import type { DesignerService } from './services/designer.service';
import type { HistoryService } from './services/history.service';
import type { PropsService } from './services/props.service';
import type { StageOverlayService } from './services/stage-overlay.service';
import type { StorageService } from './services/storage.service';
import type { UiService } from './services/ui.service';

export interface InstallOptions {
  [key: string]: any;
}
export interface Services {
  uiService: UiService;
  historyService: HistoryService;
  designerService: DesignerService;
  propsService: PropsService;
  componentListService: ComponentListService;
  storageService: StorageService;
  stageOverlayService: StageOverlayService;
}

export interface StageOptions {
  runtimeUrl?: string;
  autoScrollIntoView?: boolean;
  containerHighlightClassName?: string;
  containerHighlightDuration?: number;
  containerHighlightType?: ContainerHighlightType;

  render?: (stage: StageCore) => HTMLDivElement | void | Promise<HTMLDivElement | void>;
  moveableOptions?: MoveableOptions | ((core?: StageCore) => MoveableOptions);
  isContainer?: (el: HTMLElement) => boolean | Promise<boolean>;
  canSelect?: (el: HTMLElement) => boolean | Promise<boolean>;

  updateDragEl?: (el: HTMLDivElement) => void;
  zoom?: number;
}
export interface DesignerNodeInfo {
  node: MNode | null;
  parent: MContainer | null;
  page: MPage | null;
}
export enum ColumnLayout {
  LEFT = 'left',
  CENTER = 'center',
  RIGHT = 'right',
}

export interface SetColumnWidth {
  [ColumnLayout.LEFT]?: number;
  [ColumnLayout.CENTER]?: number | 'auto';
  [ColumnLayout.RIGHT]?: number;
}

export interface GetColumnWidth {
  [ColumnLayout.LEFT]: number;
  [ColumnLayout.CENTER]: number;
  [ColumnLayout.RIGHT]: number;
}
export interface StageRect {
  width: number;
  height: number;
}
export interface StoreState {
  root: MApp | null;
  page: MPage | null;
  parent: MContainer | null;
  node: MNode | null;
  nodes: MNode[];
  highlightNode: MNode | null;
  stage: StageCore | null;
  modifiedNodeIds: Map<Id, Id>;
  pageLength: number;
  stageLoading: boolean;
}
export interface UiState {
  /** 当前点击画布是否触发选中，true: 不触发，false: 触发，默认为false */
  uiSelectMode: boolean;
  /** 当前点击画布是否触发拖拽，true: 不触发，false: 触发，默认为false */
  stageDragMode: boolean;
  /** 是否显示整个配置源码， true: 显示， false: 不显示，默认为false */
  showSrc: boolean;
  /** 画布显示放大倍数，默认为 1 */
  zoom: number;
  /** 画布容器的宽高 */
  stageContainerRect: StageRect;
  /** 画布顶层div的宽高，可用于改变画布的大小 */
  stageRect: StageRect;
  /** 编辑器列布局每一列的宽度，分为左中右三列 */
  columnWidth: GetColumnWidth;
  /** 是否显示画布参考线，true: 显示，false: 不显示，默认为true */
  showGuides: boolean;
  /** 是否显示标尺，true: 显示，false: 不显示，默认为true */
  showRule: boolean;
  /** 用于控制该属性配置表单内组件的尺寸 */
  propsPanelSize: 'large' | 'default' | 'small';
}

/** 容器布局 */
export enum Layout {
  FLEX = 'flex',
  FIXED = 'fixed',
  RELATIVE = 'relative',
  ABSOLUTE = 'absolute',
}

export enum Keys {
  ESCAPE = 'Space',
}

export const H_GUIDE_LINE_STORAGE_KEY = '$MagicStageHorizontalGuidelinesData';
export const V_GUIDE_LINE_STORAGE_KEY = '$MagicStageVerticalGuidelinesData';

declare global {
  interface Window {
    global: any;
  }
}
export interface PropsState {
  propsConfigMap: Record<string, FormConfig>;
  propsValueMap: Record<string, MNode>;
}

export interface SideComponent extends MenuComponent {
  /** 显示文案 */
  text: string;
  /** element-plus icon class */
  icon: Component<object, object, any>;
}
/**
 * component-list: 组件列表
 * layer: 已选组件树
 */
export type SideItem = 'component-list' | 'layer' | SideComponent;

/** 工具栏 */
export interface SideBarData {
  /** 容器类型 */
  type: 'tabs';
  /** 默认激活的内容 */
  status: string;
  /** panel列表 */
  items: SideItem[];
}

/**
 * 菜单按钮
 */
export interface MenuButton {
  /**
   * 按钮类型
   * button: 只有文字不带边框的按钮
   * text: 纯文本
   * dropdown: 下拉菜单
   * divider: 分隔线
   * zoom: 放大缩小
   */
  type: 'button' | 'dropdown' | 'text' | 'divider' | 'zoom';
  /** 当type为divider时有效，分割线方向, 默认vertical */
  direction?: 'horizontal' | 'vertical';
  /** 展示的文案 */
  text?: string;
  /** 鼠标悬浮是显示的气泡中的文案 */
  tooltip?: string;
  /** element-plus icon class */
  icon?: string | Component<object, object, any>;
  /** 是否置灰，默认为false */
  disabled?: boolean | ((data?: Services) => boolean);
  /** 是否显示，默认为true */
  display?: boolean | ((data?: Services) => boolean);
  /** type为button/dropdown时点击运行的方法 */
  handler?: (data: Services, event: MouseEvent) => Promise<any> | any;
  /** type为dropdown时，下拉的菜单列表， 或者有子菜单时 */
  items?: MenuButton[];
  className?: string;
}

export interface MenuComponent {
  type: 'component';
  /** Vue3组件 */
  component: any;
  /** 传入组件的props对象 */
  props?: Record<string, any>;
  /** 组件监听的事件对象，如：{ click: () => { console.log('click'); } } */
  listeners?: Record<string, (...args: any[]) => any>;
  slots?: Record<string, any>;
  className?: string;
  /** 是否显示，默认为true */
  display?: boolean | ((data?: Services) => Promise<boolean> | boolean);
}

/**
 * '/': 分隔符
 * 'delete': 删除按钮
 * 'undo': 撤销按钮
 * 'redo': 恢复按钮
 * 'zoom-in': 放大按钮
 * 'zoom-out': 缩小按钮
 */
export type MenuItem =
  | '/'
  | 'delete'
  | 'undo'
  | 'redo'
  | 'zoom'
  | 'zoom-in'
  | 'zoom-out'
  | 'guides'
  | 'rule'
  | MenuButton
  | MenuComponent
  | string;

/** 工具栏 */
export interface MenuBarData {
  /** 顶部工具栏左边项 */
  [ColumnLayout.LEFT]?: MenuItem[];
  /** 顶部工具栏中间项 */
  [ColumnLayout.CENTER]?: MenuItem[];
  /** 顶部工具栏右边项 */
  [ColumnLayout.RIGHT]?: MenuItem[];
}

export interface AddMNode {
  type: string;
  name?: string;
  inputEvent?: DragEvent;
  [key: string]: any;
}

export interface ComponentItem {
  /** 显示文案 */
  text: string;
  /** 组件类型 */
  type: string;
  /** element-plus icon class */
  icon?: string | Component;
  data?: {
    [key: string]: any;
  };
}

export interface ComponentGroup {
  /** 显示文案 */
  title: string;
  /** 组内列表 */
  items: ComponentItem[];
}
export interface ComponentGroupState {
  list: ComponentGroup[];
}
export enum LayerOffset {
  TOP = 'top',
  BOTTOM = 'bottom',
}

export interface PastePosition {
  left?: number;
  top?: number;
  /**
   * 粘贴位置X方向偏移量
   */
  offsetX?: number;
  /**
   * 粘贴位置Y方向偏移量
   */
  offsetY?: number;
}

export interface ScrollViewerEvent {
  scrollLeft: number;
  scrollTop: number;
  scrollHeight: number;
  scrollWidth: number;
}

export interface StageOverlayState {
  wrapDiv: HTMLDivElement;
  sourceEl: HTMLElement | null;
  contentEl: HTMLElement | null;
  stage: StageCore | null;
  stageOptions: StageOptions | null;
  wrapWidth: number;
  wrapHeight: number;
  stageOverlayVisible: boolean;
}
