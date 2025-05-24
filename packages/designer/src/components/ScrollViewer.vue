<script lang="ts" setup>
import type { ScrollViewerEvent, Services } from '../type';

import KeyController from 'keycon';
import { computed, inject, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

import { ScrollViewer } from '../utils/scroll-viewer';
import ScrollBar from './ScrollBar.vue';

const props = withDefaults(
  defineProps<{
    width?: number;
    height?: number;
    wrapWidth?: number;
    wrapHeight?: number;
    zoom?: number;
  }>(),
  {
    width: 0,
    height: 0,
    wrapWidth: 0,
    wrapHeight: 0,
    zoom: 1,
  },
);

const container = ref<HTMLDivElement>();
const el = ref<HTMLDivElement>();
const style = computed(
  () => `
        width: ${props.width}px;
        height: ${props.height}px;
        position: absolute;
        margin-top: 30px;
      `,
);

const services = inject<Services>('services');
const scrollWidth = ref(0);
const scrollHeight = ref(0);

let scrollViewer: ScrollViewer;
const vOffset = ref(0);
const hOffset = ref(0);
const zoom = computed(() => services?.uiService.get('zoom') || 1);
const stageRect = computed(() => services?.uiService.get('stageRect'));
watch(
  [zoom, stageRect],
  () => {
    nextTick(() => {
      scrollViewer?.reset();
    });
  },
);
onMounted(() => {
  if (!container.value || !el.value)
    return;
  scrollViewer = new ScrollViewer({
    container: container.value,
    target: el.value,
    zoom: props.zoom,
  });

  scrollViewer.on('scroll', (data: ScrollViewerEvent) => {
    hOffset.value = data.scrollLeft;
    vOffset.value = data.scrollTop;
    scrollWidth.value = data.scrollWidth;
    scrollHeight.value = data.scrollHeight;
  });
});

onBeforeUnmount(() => {
  scrollViewer.destroy();
});

watch(
  () => props.zoom,
  () => {
    scrollViewer.setZoom(props.zoom);
  },
);

function vScrollHandler(delta: number) {
  vOffset.value += delta;
  scrollViewer.scrollTo({
    top: vOffset.value,
  });
}
function hScrollHandler(delta: number) {
  hOffset.value += delta;
  scrollViewer.scrollTo({
    left: hOffset.value,
  });
}

const isDragging = ref(false);
const isShiftPressed = ref(false);
const startPos = ref({ x: 0, y: 0 });
const startScroll = ref({ x: 0, y: 0 });
const dragMask = ref<HTMLDivElement>();

function handleMouseDown(e: MouseEvent) {
  if (!isShiftPressed.value)
    return;
  isDragging.value = true;
  startPos.value = { x: e.clientX, y: e.clientY };
  startScroll.value = { x: hOffset.value, y: vOffset.value };
  document.body.style.cursor = 'grab';
}

function handleMouseMove(e: MouseEvent) {
  if (!isDragging.value)
    return;
  const deltaX = startPos.value.x - e.clientX;
  const deltaY = startPos.value.y - e.clientY;

  if (scrollHeight.value > props.wrapHeight) {
    vOffset.value = Math.min(
      Math.max(startScroll.value.y + deltaY, 0),
      scrollHeight.value - props.wrapHeight,
    );
    scrollViewer.scrollTo({
      top: vOffset.value,
    });
  }

  if (scrollWidth.value > props.wrapWidth) {
    hOffset.value = Math.min(
      Math.max(startScroll.value.x + deltaX, 0),
      scrollWidth.value - props.wrapWidth,
    );
    scrollViewer.scrollTo({
      left: hOffset.value,
    });
  }
}

function handleMouseUp() {
  isDragging.value = false;
  document.body.style.cursor = 'default';
}
onMounted(() => {
  const ketcon = new KeyController();
  ketcon.keydown(['shift'], (e) => {
    e.inputEvent.preventDefault();
    services?.uiService.set('stageDragMode', true);
    isShiftPressed.value = true;

    if (container.value)
      container.value.style.cursor = 'grab';
  });
  ketcon.keyup(['shift'], (e) => {
    e.inputEvent.preventDefault();
    services?.uiService.set('stageDragMode', false);
    isShiftPressed.value = false;
    isDragging.value = false;
    if (container.value)
      container.value.style.cursor = 'default';
  });

  // 添加事件监听
  if (container.value) {
    container.value.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }
});

onBeforeUnmount(() => {
  scrollViewer.destroy();
  if (container.value) {
    container.value.removeEventListener('mousedown', handleMouseDown);
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  }
});

function preventDefault(e: Event) {
  e.preventDefault();
}

defineExpose({
  container,
});
</script>

<template>
  <div
    ref="container"
    class="m-editor-scroll-viewer-container"
    :class="{ dragging: isDragging }"
  >
    <div ref="el" :style="style">
      <slot />
      <!-- 添加遮罩层 -->
      <div
        v-show="isShiftPressed"
        ref="dragMask"
        :style="`transform: scale(${zoom});`"
        class="drag-mask"
        @mousedown="preventDefault"
        @click="preventDefault"
        @contextmenu="preventDefault"
        @dragstart="preventDefault"
      />
    </div>

    <ScrollBar
      v-if="scrollHeight > wrapHeight"
      :scroll-size="scrollHeight"
      :size="wrapHeight"
      :pos="vOffset"
      @scroll="vScrollHandler"
    />
    <ScrollBar
      v-if="scrollWidth > wrapWidth"
      :is-horizontal="true"
      :scroll-size="scrollWidth"
      :pos="hOffset"
      :size="wrapWidth"
      @scroll="hScrollHandler"
    />
  </div>
</template>

<style scoped>
.m-editor-scroll-viewer-container.dragging {
  cursor: grabbing !important;
}

.drag-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background: transparent;
  user-select: none;
}
</style>
