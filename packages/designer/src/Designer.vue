<script setup lang="ts">
import type { EventOption } from '@lowcode/core';
import type { FormConfig } from '@lowcode/form';
import type { MApp, MContainer, MNode } from '@lowcode/schema';
import type StageCore from '@lowcode/stage';
import type { MoveableOptions } from '@lowcode/stage';
import type { ComponentGroup, MenuBarData, MenuButton, MenuComponent, Services, SideBarData, StageRect } from './type';
import { CONTAINER_HIGHLIGHT_CLASS, ContainerHighlightType } from '@lowcode/stage';
import { onBeforeUnmount, provide, reactive, ref, toRaw, watch } from 'vue';
import Framework from './layouts/Framework.vue';
import NavMenu from './layouts/NavMenu.vue';
import PropsPanel from './layouts/PropsPanel.vue';
import Sidebar from './layouts/sidebar/Sidebar.vue';
import Workspace from './layouts/workspace/Workspace.vue';
import componentListService from './services/component-list.service';
import designerService from './services/designer.service';
import eventsService from './services/events.service';
import historyService from './services/history.service';
import propsService from './services/props.service';
import storageService from './services/storage.service';
import uiService from './services/ui.service';

defineOptions({
  name: 'LowCodeDesigner',
});

const props = withDefaults(
  defineProps<{
    layerContentMenu?: (MenuButton | MenuComponent)[];
    defaultSelected?: number | string;
    moveableOptions: MoveableOptions | ((core?: StageCore) => MoveableOptions);
    propsConfigs: Record<string, FormConfig>;
    eventMethodList: Record<string, { events: EventOption[]; methods: EventOption[] }>;
    menu: MenuBarData;
    /** 左侧面板配置 */
    sidebar?: SideBarData;
    stageRect?: StageRect;
    componentGroupList?: ComponentGroup[];
    propsValues?: Record<string, MNode>;
    isContainer?: (el: HTMLElement) => boolean | Promise<boolean>;
    containerHighlightClassName?: string;
    containerHighlightDuration?: number;
    runtimeUrl?: string;
    containerHighlightType?: ContainerHighlightType;
  }>(),
  {
    defaultSelected: '',
    moveableOptions: () => ({}),
    propsConfigs: () => ({}),
    eventMethodList: () => ({}),
    menu: () => ({ left: [], right: [] }),
    componentGroupList: () => [],
    propsValues: () => ({}),
    isContainer: (el: HTMLElement) => el.classList.contains('lowcode-ui-container'),
    containerHighlightClassName: CONTAINER_HIGHLIGHT_CLASS,
    containerHighlightDuration: 800,
    containerHighlightType: ContainerHighlightType.DEFAULT,
  },
);

defineEmits(['propsPanelMounted']);

const modelValue = defineModel<MApp | undefined>({ required: true });
designerService.on('root-change', async (value) => {
  if (!value)
    return;
  const nodeId = designerService.get('node')?.id || props.defaultSelected;
  let node;
  if (nodeId) {
    node = designerService.getNodeById(nodeId);
  }
  if (node && node !== value) {
    await designerService.select(node.id);
  }
  else if (value.items?.length) {
    await designerService.select(value.items[0]);
  }
  else if (value.id) {
    designerService.set('nodes', [value]);
    designerService.set('parent', null);
    designerService.set('page', null);
  }
  modelValue.value = toRaw(value);
});

const services: Services = {
  uiService,
  historyService,
  designerService,
  propsService,
  componentListService,
  storageService,
};

watch(
  modelValue,
  (n) => {
    designerService.set('root', toRaw(n) || null);
  },
  {
    immediate: true,
  },
);
watch(
  () => props.propsValues,
  values => propsService.setPropsValues(values),
  {
    immediate: true,
  },
);
watch(
  () => props.componentGroupList,
  componentGroupList => componentListService.setList(componentGroupList),
  {
    immediate: true,
  },
);
watch(
  () => props.eventMethodList,
  (eventMethodList) => {
    const eventsList: Record<string, EventOption[]> = {};
    const methodsList: Record<string, EventOption[]> = {};

    Object.keys(eventMethodList).forEach((type: string) => {
      eventsList[type] = eventMethodList[type].events;
      methodsList[type] = eventMethodList[type].methods;
    });

    eventsService.setEvents(eventsList);
    eventsService.setMethods(methodsList);
  },
  {
    immediate: true,
  },
);

watch(
  () => props.propsConfigs,
  configs => propsService.setPropsConfigs(configs),
  {
    immediate: true,
  },
);

watch(
  () => props.stageRect,
  stageRect => stageRect && uiService.set('stageRect', stageRect),
  {
    immediate: true,
  },
);
uiService.initColumnWidth();

onBeforeUnmount(() => {
  designerService.destroy();
  historyService.destroy();
  propsService.destroy();
  uiService.destroy();
  componentListService.destroy();
  storageService.destroy();
});
provide<Services>('services', services);
provide(
  'stageOptions',
  reactive({
    runtimeUrl: props.runtimeUrl,
    autoScrollIntoView: true,
    render: null,
    moveableOptions: props.moveableOptions,
    canSelect: (el: HTMLElement) => Boolean(el.id),
    updateDragEl: null,
    isContainer: props.isContainer,
    containerHighlightClassName: props.containerHighlightClassName,
    containerHighlightDuration: props.containerHighlightDuration,
    containerHighlightType: props.containerHighlightType,
  }),
);
designerService.usePlugin({
  beforeDoAdd: (config: MNode, parent?: MContainer | null) => {
    if (config.type === 'overlay') {
      config.style = {
        ...config.style,
        left: 0,
        top: 0,
      };

      return [config, designerService.get('page')];
    }

    return [config, parent];
  },
});
defineExpose({
  ...services,
});
</script>

<template>
  <Framework>
    <template #header>
      <slot name="header">
        <NavMenu :data="menu" />
      </slot>
    </template>
    <template #sidebar>
      <slot name="sidebar">
        <Sidebar :data="sidebar">
          <template #layer-panel-header>
            <slot name="layer-panel-header" />
          </template>

          <template #component-list-panel-header>
            <slot name="component-list-panel-header" />
          </template>
        </Sidebar>
      </slot>
    </template>
    <template #workspace>
      <slot name="workspace">
        <Workspace>
          <template #stage>
            <slot name="stage" />
          </template>
          <template #workspace-content>
            <slot name="workspace-content" />
          </template>
        </Workspace>
      </slot>
    </template>
    <template #props-panel>
      <slot name="props-panel">
        <PropsPanel
          @mounted="(instance) => $emit('propsPanelMounted', instance)"
        />
      </slot>
    </template>
  </Framework>
</template>

<style>
#app {
  width: 100%;
  height: 100%;
  display: flex;
}
</style>
