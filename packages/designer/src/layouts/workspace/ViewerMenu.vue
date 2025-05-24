<script setup lang="ts">
import type { MNode } from '@low-code/schema';
import type { ComponentGroup, MenuButton, MenuComponent, Services } from '../../type';
import { NodeType } from '@low-code/schema';
import { isPage } from '@low-code/utils';
import { CopyOutlined, DeleteOutlined, DownOutlined, UpOutlined } from '@vicons/antd';
import { computed, inject, markRaw, reactive, ref, watch } from 'vue';
import ContentMenu from '../../components/ContentMenu.vue';
import storageService from '../../services/storage.service';
import { LayerOffset, Layout } from '../../type';
import { COPY_STORAGE_KEY } from '../../utils/editor';

const props = defineProps<{
  isMultiSelect: boolean;
}>();
const services = inject<Services>('services');
const stageContentMenu = inject<(MenuButton | MenuComponent)[]>('stageContentMenu', []);
const designerService = services?.designerService;

const menu = ref<InstanceType<typeof ContentMenu>>();

const allowCenter = ref(false);
const allowPaste = ref(false);
const allowReplace = ref(false);
const node = computed(() => designerService?.get('node'));
const nodes = computed(() => designerService?.get('nodes'));
const stage = computed(() => designerService?.get('stage'));
const componentList = computed(() => services?.componentListService.getList() || []);
function createMenuItems(group: ComponentGroup): MenuButton[] {
  return group.items.map(component => ({
    text: component.text,
    type: 'button',
    icon: component.icon,
    handler: () => {
      const config = {
        name: component.text,
        type: component.type,
        style: {},
        ...(component.data || {}),
      } as MNode;
      // const config: MNode[] = await storageService.getItem(COPY_STORAGE_KEY);
      nodes.value && designerService?.replace(nodes.value, [config]);
    },
  }));
}
const getSubMenuData = computed<MenuButton[]>(() => {
  if (node.value?.items) {
    return (([] as MenuButton[]).concat([{
      text: '复制的内容',
      type: 'button',
      icon: markRaw(CopyOutlined),
      display: () => allowPaste.value,
      handler: async () => {
        const config: MNode[] = await storageService.getItem(COPY_STORAGE_KEY);
        if (!config || config.length === 0)
          return;
        nodes.value && designerService?.replace(nodes.value, config);
      },
    }], (componentList.value.reduce(
      (subMenuData: MenuButton[], group: ComponentGroup, index) =>
        subMenuData.concat(
          createMenuItems(group),
          index < componentList.value.length - 1
            ? [
                {
                  type: 'divider',
                  direction: 'horizontal',
                },
              ]
            : [],
        ),
      [],
    ) || []))

    );
  }
  return [];
});
const parent = computed(() => designerService?.get('parent'));
const menuData = reactive<(MenuButton | MenuComponent)[]>([
  {
    type: 'button',
    text: '水平居中',
    display: () => allowCenter.value,
    handler: () => {
      if (!nodes.value)
        return;
      designerService?.alignCenter(nodes.value);
    },
  },
  {
    type: 'button',
    text: '复制',
    icon: markRaw(CopyOutlined),
    handler: () => {
      nodes.value && designerService?.copy(nodes.value);
      allowPaste.value = true;
      allowReplace.value = true;
    },
  },
  {
    type: 'button',
    text: '粘贴',
    display: () => allowPaste.value,
    handler: () => {
      const rect = menu.value?.$el.getBoundingClientRect();
      const parentRect = stage.value?.container?.getBoundingClientRect();
      const initialLeft = (rect?.left || 0) - (parentRect?.left || 0);
      const initialTop = (rect?.top || 0) - (parentRect?.top || 0);

      if (!nodes.value || nodes.value.length === 0)
        return;
      designerService?.paste({ left: initialLeft, top: initialTop });
    },
  },
  {
    type: 'button',
    display: () => allowPaste.value && !isPage(node.value),
    text: '替换为...',
    icon: markRaw(CopyOutlined),
    items: getSubMenuData.value,
  },
  {
    type: 'divider',
    direction: 'horizontal',
    display: () => {
      if (!node.value)
        return false;
      return !isPage(node.value);
    },
  },
  {
    type: 'button',
    text: '上移一层',
    icon: markRaw(UpOutlined),
    display: () => !isPage(node.value) && !props.isMultiSelect,
    handler: () => {
      designerService?.moveLayer(1);
    },
  },
  {
    type: 'button',
    text: '下移一层',
    icon: markRaw(DownOutlined),
    display: () => !isPage(node.value) && !props.isMultiSelect,
    handler: () => {
      designerService?.moveLayer(-1);
    },
  },
  {
    type: 'button',
    text: '置顶',
    display: () => !isPage(node.value) && !props.isMultiSelect,
    handler: () => {
      designerService?.moveLayer(LayerOffset.TOP);
    },
  },
  {
    type: 'button',
    text: '置底',
    display: () => !isPage(node.value) && !props.isMultiSelect,
    handler: () => {
      designerService?.moveLayer(LayerOffset.BOTTOM);
    },
  },
  {
    type: 'divider',
    direction: 'horizontal',
    display: () => !isPage(node.value) && !props.isMultiSelect,
  },
  {
    type: 'button',
    text: '删除',
    icon: markRaw(DeleteOutlined),
    display: () => !isPage(node.value),
    handler: () => {
      nodes.value && designerService?.remove(nodes.value);
    },
  },
  {
    type: 'divider',
    direction: 'horizontal',
  },
  {
    type: 'button',
    text: '清空参考线',
    handler: () => {
      designerService?.get('stage')!.clearGuides();
    },
  },
  ...stageContentMenu,
]);

watch(
  parent,
  async () => {
    if (!parent.value || !designerService)
      return (allowCenter.value = false);
    const layout = await designerService.getLayout(parent.value);
    const isLayoutConform = [Layout.ABSOLUTE, Layout.FIXED].includes(layout);
    const isTypeConform = nodes.value?.every(
      selectedNode => ![NodeType.ROOT, NodeType.PAGE, 'pop'].includes(`${selectedNode?.type}`),
    );
    allowCenter.value = isLayoutConform && !!isTypeConform;
  },
  { immediate: true },
);
defineExpose({
  async show(e: MouseEvent) {
    menu.value?.show(e);
    const data = await storageService.getItem(COPY_STORAGE_KEY);
    allowReplace.value = allowPaste.value = data !== 'undefined' && !!data;
  },
});
</script>

<template>
  <ContentMenu ref="menu" :menu-data="menuData" />
</template>
