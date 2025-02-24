import type { SortEventData, UpdateEventData } from '@lowcode/stage';
import type { StageOptions } from '../type';
import StageCore, { GuidesType } from '@lowcode/stage';

import { computed } from 'vue';
import editorService from '../services/designer.service';
import uiService from '../services/ui.service';
import { H_GUIDE_LINE_STORAGE_KEY, V_GUIDE_LINE_STORAGE_KEY } from '../type';

import { getGuideLineFromCache } from './editor';

const root = computed(() => editorService.get('root'));
const page = computed(() => editorService.get('page'));
const zoom = computed(() => uiService.get('zoom') || 1);
const uiSelectMode = computed(() => uiService.get('uiSelectMode'));

const getGuideLineKey = (key: string) => `${key}_${root.value?.id}_${page.value?.id}`;

export function useStage(stageOptions: StageOptions) {
  const stage = new StageCore({
    render: stageOptions.render,
    runtimeUrl: stageOptions.runtimeUrl,
    zoom: zoom.value,
    autoScrollIntoView: stageOptions.autoScrollIntoView,
    isContainer: stageOptions.isContainer,
    containerHighlightClassName: stageOptions.containerHighlightClassName,
    containerHighlightDuration: stageOptions.containerHighlightDuration,
    containerHighlightType: stageOptions.containerHighlightType,
    canSelect: (el, event, stop) => {
      const elCanSelect = stageOptions.canSelect(el);
      // 在组件联动过程中不能再往下选择，返回并触发 ui-select
      if (uiSelectMode.value && elCanSelect && event.type === 'mousedown') {
        document.dispatchEvent(new CustomEvent('ui-select', { detail: el }));
        return stop();
      }

      return elCanSelect;
    },
    moveableOptions: stageOptions.moveableOptions,
    updateDragEl: stageOptions.updateDragEl,
  });

  stage.mask.setGuides([
    getGuideLineFromCache(getGuideLineKey(H_GUIDE_LINE_STORAGE_KEY)),
    getGuideLineFromCache(getGuideLineKey(V_GUIDE_LINE_STORAGE_KEY)),
  ]);

  stage.on('select', (el: HTMLElement) => {
    editorService.select(el.id);
  });

  stage.on('highlight', (el: HTMLElement) => {
    editorService.highlight(el.id);
  });

  stage.on('multiSelect', (els: HTMLElement[]) => {
    editorService.multiSelect(els.map(el => el.id));
  });

  stage.on('update', (ev: UpdateEventData) => {
    if (ev.parentEl) {
      for (const data of ev.data) {
        editorService.moveToContainer({ id: data.el.id, style: data.style }, ev.parentEl.id);
      }
      return;
    }

    editorService.update(ev.data.map(data => ({ id: data.el.id, style: data.style })));
  });

  stage.on('sort', (ev: SortEventData) => {
    editorService.sort(ev.src, ev.dist);
  });

  stage.on('changeGuides', (e) => {
    uiService.set('showGuides', true);

    if (!root.value || !page.value)
      return;

    const storageKey = getGuideLineKey(
      e.type === GuidesType.HORIZONTAL ? H_GUIDE_LINE_STORAGE_KEY : V_GUIDE_LINE_STORAGE_KEY,
    );
    if (e.guides.length) {
      globalThis.localStorage.setItem(storageKey, JSON.stringify(e.guides));
    }
    else {
      globalThis.localStorage.removeItem(storageKey);
    }
  });

  return stage;
}
