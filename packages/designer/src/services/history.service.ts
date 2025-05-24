import type { Id, MPage } from '@low-code/schema';
import { reactive } from 'vue';

import { UndoRedo } from '../utils/undo-redo';
import BaseService from './base.service';

export interface StepValue {
  data: MPage;
  modifiedNodeIds: Map<Id, Id>;
  nodeId: Id;
}

interface HistoryState {
  pageSteps: Record<Id, UndoRedo<StepValue>>;
  pageId?: Id;
  canRedo: boolean;
  canUndo: boolean;
}
function getInitialHistoryState(): HistoryState {
  return {
    pageSteps: {},
    pageId: undefined,
    canRedo: false,
    canUndo: false,
  };
}
class History extends BaseService {
  public state = reactive<HistoryState>(getInitialHistoryState());

  constructor() {
    super([]);
    this.on('change', this.setCanUndoRedo);
  }

  public reset() {
    Object.assign(this.state, getInitialHistoryState());
    this.resetPage();
  }

  public resetPage() {
    this.state.pageId = undefined;
    this.state.canRedo = false;
    this.state.canUndo = false;
  }

  public changePage(page: MPage) {
    if (!page)
      return;

    this.state.pageId = page.id;

    if (!this.state.pageSteps[this.state.pageId]) {
      const undoRedo = new UndoRedo<StepValue>();
      undoRedo.pushElement({
        data: page,
        modifiedNodeIds: new Map(),
        nodeId: page.id,
      });
      this.state.pageSteps[this.state.pageId] = undoRedo;
    }
    this.setCanUndoRedo();
  }

  push(state: StepValue): StepValue | null {
    const undoRedo = this.getUndoRedo();
    if (!undoRedo)
      return null;

    undoRedo.pushElement(state);
    this.emit('change', state);
    return state;
  }

  public undo() {
    const undoRedo = this.getUndoRedo();
    if (!undoRedo)
      return null;
    console.log('undo');

    const state = undoRedo.undo();
    this.emit('change', state);
    return state;
  }

  public redo() {
    const undoRedo = this.getUndoRedo();
    if (!undoRedo)
      return null;
    console.log('redo');

    const state = undoRedo.redo();
    this.emit('change', state);
    return state;
  }

  public destroy(): void {
    this.reset();
    this.removeAllListeners();
  }

  private getUndoRedo() {
    if (!this.state.pageId)
      return null;
    return this.state.pageSteps[this.state.pageId];
  }

  private setCanUndoRedo() {
    const undoRedo = this.getUndoRedo();

    this.state.canUndo = undoRedo?.canUndo() || false;
    this.state.canRedo = undoRedo?.canRedo() || false;
  }
}
export type HistoryService = History;

export default new History();
