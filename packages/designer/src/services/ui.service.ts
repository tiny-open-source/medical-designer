import type { SetColumnWidth, StageRect, UiState } from '../type';
import { reactive, toRaw } from 'vue';
import BaseService from '../services/base.service';
import designerService from './designer.service';

// 导出常量供其他组件使用
export const DEFAULT_LEFT_COLUMN_WIDTH = 310;
export const MIN_LEFT_COLUMN_WIDTH = 60;
export const DEFAULT_RIGHT_COLUMN_WIDTH = 480;
export const MIN_RIGHT_COLUMN_WIDTH = 380;
export const MIN_CENTER_COLUMN_WIDTH = 200;

const COLUMN_WIDTH_STORAGE_KEY = '$MagicEditorColumnWidthData';
const BODY_WIDTH = globalThis.document.body.clientWidth;

const defaultColumnWidth = {
  left: DEFAULT_LEFT_COLUMN_WIDTH,
  center: BODY_WIDTH - DEFAULT_LEFT_COLUMN_WIDTH - DEFAULT_RIGHT_COLUMN_WIDTH,
  right: DEFAULT_RIGHT_COLUMN_WIDTH,
};
const state = reactive<UiState>({
  uiSelectMode: false,
  stageDragMode: false,
  showSrc: false,
  zoom: 1,
  stageContainerRect: {
    width: 0,
    height: 0,
  },
  stageRect: {
    width: 1024,
    height: 600,
  },
  columnWidth: defaultColumnWidth,
  showGuides: true,
  showRule: true,
  propsPanelSize: 'small',
});
class Ui extends BaseService {
  constructor() {
    super([]);
    globalThis.addEventListener('resize', () => {
      this.setColumnWidth({
        center: 'auto',
      });
    });
  }

  public get<K extends keyof UiState>(name: K): UiState[K] {
    return state[name];
  }

  public set<T>(name: keyof typeof state, value: T) {
    const mask = designerService.get('stage')?.mask;
    if (name === 'columnWidth') {
      this.setColumnWidth(value as unknown as SetColumnWidth);
      return;
    }
    if (name === 'stageRect') {
      this.setStageRect(value as unknown as StageRect);
      return;
    }
    if (name === 'showGuides') {
      mask?.showGuides(value as unknown as boolean);
    }

    if (name === 'showRule') {
      mask?.showRule(value as unknown as boolean);
    }

    (state as any)[name] = value;
  }

  public zoom(zoom: number) {
    this.set('zoom', (this.get('zoom') * 100 + zoom * 100) / 100);
    if (this.get('zoom') < 0.1)
      this.set('zoom', 0.1);
  }

  private setStageRect(value: StageRect) {
    state.stageRect = {
      ...state.stageRect,
      ...value,
    };
    state.zoom = this.calcZoom();
  }

  private setColumnWidth({ left, right }: SetColumnWidth) {
    const columnWidth = {
      ...toRaw(this.get('columnWidth')),
    }; // 获取当前窗口宽度
    const currentBodyWidth = globalThis.document.body.clientWidth;

    if (left !== undefined) {
      columnWidth.left = Math.max(left, MIN_LEFT_COLUMN_WIDTH);
      // 确保左侧列不会太大，给中间列和右侧列留出空间
      const maxLeft = currentBodyWidth - columnWidth.right - MIN_CENTER_COLUMN_WIDTH;
      columnWidth.left = Math.min(columnWidth.left, maxLeft);
    }
    if (right !== undefined) {
      columnWidth.right = Math.max(right, MIN_RIGHT_COLUMN_WIDTH);
      // 确保右侧列不会太大，给中间列和左侧列留出空间
      const maxRight = currentBodyWidth - columnWidth.left - MIN_CENTER_COLUMN_WIDTH;
      columnWidth.right = Math.min(columnWidth.right, maxRight);
    }

    // 计算中间列的宽度
    columnWidth.center = currentBodyWidth - (columnWidth?.left || 0) - (columnWidth?.right || 0);

    // 如果中间列宽度小于最小值，重置为默认值
    if (columnWidth.center < MIN_CENTER_COLUMN_WIDTH) {
      columnWidth.left = defaultColumnWidth.left;
      columnWidth.center = currentBodyWidth - defaultColumnWidth.left - defaultColumnWidth.right;
      columnWidth.right = defaultColumnWidth.right;
    }

    globalThis.localStorage.setItem(COLUMN_WIDTH_STORAGE_KEY, JSON.stringify(columnWidth));
    state.columnWidth = columnWidth;
  }

  public initColumnWidth() {
    const columnWidthCacheData = globalThis.localStorage.getItem(COLUMN_WIDTH_STORAGE_KEY);
    if (columnWidthCacheData) {
      try {
        const columnWidthCache = JSON.parse(columnWidthCacheData);
        this.setColumnWidth(columnWidthCache);
      }
      catch (e) {
        console.error(e);
      }
    }
  }

  public destroy() {
    this.removeAllListeners();
  }

  public calcZoom() {
    const { stageRect, stageContainerRect } = state;
    const { height, width } = stageContainerRect;
    if (!width || !height)
      return 1;

    // 30为标尺的大小
    const stageWidth = stageRect.width + 30;
    const stageHeight = stageRect.height + 30;

    if (width > stageWidth && height > stageHeight) {
      return 1;
    }
    // 60/80是为了不要让画布太过去贴住四周（这样好看些）
    return Math.min((width - 80) / stageWidth || 1, (height - 80) / stageHeight || 1);
  }
}
export type UiService = Ui;
export default new Ui();
