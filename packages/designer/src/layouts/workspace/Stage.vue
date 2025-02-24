<script setup lang="ts">
import type { MContainer } from '@lowcode/schema';
import type { Runtime } from '@lowcode/stage';
import type StageCore from '@lowcode/stage';
import type { Services, StageOptions } from '../../type';
import { calcValueByFontsize, getOffset } from '@lowcode/stage';
import { cloneDeep } from 'lodash-es';
import { computed, inject, markRaw, onBeforeUnmount, onMounted, ref, toRaw, watch, watchEffect } from 'vue';
import ScrollViewer from '../../components/ScrollViewer.vue';
import { Layout } from '../../type';
import { useStage } from '../../utils';
import ViewerMenu from './ViewerMenu.vue';

const stageContainer = ref<HTMLDivElement | null>(null);
const stageOptions = inject<StageOptions>('stageOptions');
const services = inject<Services>('services');
let stage: StageCore | null = null;
let runtime: Runtime | null = null;

const root = computed(() => services?.designerService.get('root'));
const stageRect = computed(() => services?.uiService.get('stageRect'));
const zoom = computed(() => services?.uiService.get('zoom') || 1);
const stageContainerRect = computed(() => services?.uiService.get('stageContainerRect') || { width: 0, height: 0 });
const isMultiSelect = computed(() => !!(services?.designerService.get('nodes') && services?.designerService.get('nodes').length > 1));
const page = computed(() => services?.designerService.get('page'));
const node = computed(() => services?.designerService.get('node'));
const stageWrap = ref<InstanceType<typeof ScrollViewer> | null>(null);
const menu = ref<InstanceType<typeof ViewerMenu>>();

watchEffect(() => {
  if (stage)
    return;

  if (!stageContainer.value)
    return;
  if (!(stageOptions?.runtimeUrl || stageOptions?.render) || !root.value)
    return;
  stage = useStage(stageOptions!);
  services?.designerService.set('stage', markRaw(stage));

  stage?.mount(stageContainer.value);

  if (!node.value?.id)
    return;
  stage.on('runtime-ready', (rt) => {
    runtime = rt;
    // toRaw返回的值是一个引用而非快照，需要cloneDeep
    root.value && runtime?.updateRootConfig?.(cloneDeep(toRaw(root.value)));
    page.value?.id && runtime?.updatePageId?.(page.value.id);
    setTimeout(() => {
      node.value && stage?.select(toRaw(node.value.id));
    });
  });
});
watch(zoom, (zoom) => {
  if (!stage || !zoom)
    return;
  stage.setZoom(zoom);
});

watch(root, (root) => {
  if (runtime && root) {
    runtime.updateRootConfig?.(cloneDeep(toRaw(root)));
  }
});
const resizeObserver = new ResizeObserver((entries) => {
  for (const { contentRect } of entries) {
    services?.uiService.set('stageContainerRect', {
      width: contentRect.width,
      height: contentRect.height,
    });
  }
});
async function dropHandler(e: DragEvent) {
  e.preventDefault();

  const doc = stage?.renderer.contentWindow?.document;
  const parentEl: HTMLElement | null | undefined = doc?.querySelector(
    `.${stageOptions?.containerHighlightClassName}`,
  );

  let parent: MContainer | null | undefined = page.value;
  if (parentEl) {
    parent = services?.designerService.getNodeById(parentEl.id, false) as MContainer;
  }

  if (e.dataTransfer && parent && stageContainer.value && stage) {
    // eslint-disable-next-line no-eval
    const config = eval(`(${e.dataTransfer.getData('data')})`);
    const layout = await services?.designerService.getLayout(parent);

    const containerRect = stageContainer.value.getBoundingClientRect();
    const { scrollTop, scrollLeft } = stage.mask;

    const { style = {} } = config;

    let top = 0;
    let left = 0;
    let position = 'relative';

    if (layout === Layout.ABSOLUTE) {
      position = 'absolute';
      top = e.clientY - containerRect.top + scrollTop;
      left = e.clientX - containerRect.left + scrollLeft;

      if (parentEl && doc) {
        const { left: parentLeft, top: parentTop } = getOffset(parentEl);
        left = left - calcValueByFontsize(doc, parentLeft);
        top = top - calcValueByFontsize(doc, parentTop);
      }
    }

    config.style = {
      ...style,
      position,
      top: top / zoom.value,
      left: left / zoom.value,
    };

    config.inputEvent = e;
    services?.designerService.add(config, parent);
  }
}
function dragoverHandler(e: DragEvent) {
  e.preventDefault();
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = 'move';
  }
}
function contextmenuHandler(e: MouseEvent) {
  e.preventDefault();
  if (menu.value) {
    menu.value.show(e);
  }
}
onMounted(() => {
  stageWrap.value?.container && resizeObserver.observe(stageWrap.value.container);
});
onBeforeUnmount(() => {
  stage?.destroy();
  resizeObserver.disconnect();
  services?.designerService.set('stage', null);
});
</script>

<template>
  <ScrollViewer
    ref="stageWrap"
    class="lc-d-stage"
    :width="stageRect?.width"
    :height="stageRect?.height"
    :wrap-width="stageContainerRect?.width"
    :wrap-height="stageContainerRect?.height"
    :zoom="zoom"
  >
    <div
      ref="stageContainer"
      class="lc-d-stage-container"
      :style="`transform: scale(${zoom});`"
      @contextmenu="contextmenuHandler"
      @drop="dropHandler"
      @dragover="dragoverHandler"
    />
    <teleport to="body">
      <ViewerMenu ref="menu" :is-multi-select="isMultiSelect" />
    </teleport>
  </ScrollViewer>
</template>
