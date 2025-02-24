<script lang="ts" setup>
import type { GetColumnWidth, MenuBarData, MenuButton, MenuComponent, MenuItem, Services } from '../type';
import { NodeType } from '@lowcode/schema';

import { ArrowLeftOutlined, ArrowRightOutlined, BorderInnerOutlined, BorderOuterOutlined, DeleteOutlined, FullscreenOutlined, TableOutlined, ZoomInOutlined, ZoomOutOutlined } from '@vicons/antd';

import { computed, inject, markRaw } from 'vue';
import ToolButton from '../components/ToolButton.vue';
import { ColumnLayout } from '../type';

const props = withDefaults(
  defineProps<{
    data?: MenuBarData;
    height?: number;
  }>(),
  {
    data: () => ({}),
    height: 35,
  },
);

const services = inject<Services>('services');
const uiService = services?.uiService;
const designerService = services?.designerService;

const columnWidth = computed(() => services?.uiService.get('columnWidth'));
const keys = Object.values(ColumnLayout);

const showGuides = computed((): boolean => uiService?.get('showGuides') ?? true);
const showRule = computed((): boolean => uiService?.get('showRule') ?? true);
const zoom = computed((): number => uiService?.get('zoom') ?? 1);

const isMac = /mac os x/.test(navigator.userAgent.toLowerCase());
const ctrl = isMac ? 'Command' : 'Ctrl';

function getConfig(item: MenuItem): (MenuButton | MenuComponent)[] {
  if (typeof item !== 'string') {
    return [item];
  }
  const config: (MenuButton | MenuComponent)[] = [];
  switch (item) {
    case '/':
      config.push({
        type: 'divider',
        className: 'divider',
      });
      break;
    case 'zoom':
      config.push(
        ...getConfig('zoom-out'),
        ...getConfig(`${Number.parseInt(`${zoom.value * 100}`, 10)}%`),
        ...getConfig('zoom-in'),
        ...getConfig('scale-to-original'),
        ...getConfig('scale-to-fit'),
      );
      break;
    case 'delete':
      config.push({
        type: 'button',
        className: 'delete',
        icon: markRaw(DeleteOutlined),
        tooltip: `刪除(Delete)`,
        disabled: () => services?.designerService.get('node')?.type === NodeType.PAGE,
        handler: () => {
          const node = designerService?.get('node');
          node && designerService?.remove(node);
        },
      });
      break;
    case 'undo':
      config.push({
        type: 'button',
        className: 'undo',
        icon: markRaw(ArrowLeftOutlined),
        tooltip: `后退(${ctrl}+z)`,
        disabled: () => !services?.historyService.state.canUndo,
        handler: () => services?.designerService.undo(),
      });
      break;
    case 'redo':
      config.push({
        type: 'button',
        className: 'redo',
        icon: markRaw(ArrowRightOutlined),
        tooltip: `前进(${ctrl}+Shift+z)`,
        disabled: () => !services?.historyService.state.canRedo,
        handler: () => services?.designerService.redo(),
      });
      break;
    case 'zoom-in':
      config.push({
        type: 'button',
        className: 'zoom-in',
        icon: markRaw(ZoomInOutlined),
        tooltip: `放大(${ctrl}+=)`,
        handler: () => uiService?.zoom(0.1),
      });
      break;
    case 'zoom-out':
      config.push({
        type: 'button',
        className: 'zoom-out',
        icon: markRaw(ZoomOutOutlined),
        tooltip: `缩小(${ctrl}+-)`,
        handler: () => uiService?.zoom(-0.1),
      });
      break;
    case 'scale-to-original':
      config.push({
        type: 'button',
        className: 'scale-to-original',
        icon: markRaw(BorderOuterOutlined),
        tooltip: `缩放到实际大小(${ctrl}+1)`,
        handler: () => uiService?.set('zoom', 1),
      });
      break;
    case 'scale-to-fit':
      config.push({
        type: 'button',
        className: 'scale-to-fit',
        icon: markRaw(FullscreenOutlined),
        tooltip: `缩放以适应(${ctrl}+0)`,
        handler: () => uiService?.set('zoom', uiService.calcZoom()),
      });
      break;
    case 'rule':
      config.push({
        type: 'button',
        className: 'rule',
        icon: markRaw(BorderInnerOutlined),
        tooltip: showRule.value ? '隐藏标尺' : '显示标尺',
        handler: () => uiService?.set('showRule', !showRule.value),
      });
      break;
    case 'guides':
      config.push({
        type: 'button',
        className: 'guides',
        icon: markRaw(TableOutlined),
        tooltip: showGuides.value ? '隐藏参考线' : '显示参考线',
        handler: () => uiService?.set('showGuides', !showGuides.value),
      });
      break;
    default:
      config.push({
        type: 'text',
        text: item,
      });
  }
  return config;
}

const buttons = computed(() => {
  const data: {
    [ColumnLayout.LEFT]: (MenuButton | MenuComponent)[];
    [ColumnLayout.CENTER]: (MenuButton | MenuComponent)[];
    [ColumnLayout.RIGHT]: (MenuButton | MenuComponent)[];
  } = {
    [ColumnLayout.LEFT]: [],
    [ColumnLayout.CENTER]: [],
    [ColumnLayout.RIGHT]: [],
  };
  keys.forEach((key) => {
    const items = props.data[key] || [];
    items.forEach((item) => {
      data[key].push(...getConfig(item));
    });
  });
  return data;
});
</script>

<template>
  <div class="lc-d-nav-menu" :style="{ height: `${height}px` }">
    <div v-for="key in keys" :key="key" :class="`menu-${key}`" :style="`width: ${columnWidth?.[key]}px`">
      <ToolButton v-for="(item, index) in buttons[key]" :key="index" :data="item" />
    </div>
  </div>
</template>
