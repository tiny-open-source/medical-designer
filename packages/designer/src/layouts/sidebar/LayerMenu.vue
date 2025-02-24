<script setup lang="ts">
import type { ComponentGroup, MenuButton, MenuComponent, Services } from '../../type';
import { NodeType } from '@lowcode/schema';
import { CopyOutlined, DeleteOutlined, PlusOutlined } from '@vicons/antd';
import { computed, inject, markRaw, ref } from 'vue';
import ContentMenu from '../../components/ContentMenu.vue';

const services = inject<Services>('services');
const menu = ref<InstanceType<typeof ContentMenu>>();
const node = computed(() => services?.designerService.get('node'));
const isRoot = computed(() => node.value?.type === NodeType.ROOT);
const isPage = computed(() => node.value?.type === NodeType.PAGE);
const componentList = computed(() => services?.componentListService.getList() || []);
const layerContentMenu = inject<(MenuComponent | MenuButton)[]>('layerContentMenu', []);

function createMenuItems(group: ComponentGroup): MenuButton[] {
  return group.items.map(component => ({
    text: component.text,
    type: 'button',
    icon: component.icon,
    handler: () => {
      services?.designerService.add({
        name: component.text,
        type: component.type,
        ...(component.data || {}),
      });
    },
  }));
}

const getSubMenuData = computed<MenuButton[]>(() => {
  if (node.value?.type === 'tabs') {
    return [
      {
        text: '标签页',
        type: 'button',
        // icon: Files,
        handler: () => {
          services?.designerService.add({
            type: 'tab-pane',
          });
        },
      },
    ];
  }
  if (node.value?.items) {
    return (
      componentList.value.reduce(
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
      ) || []
    );
  }
  return [];
});

const menuData = computed<(MenuButton | MenuComponent)[]>(() => [
  {
    type: 'button',
    text: '新增',
    icon: markRaw(PlusOutlined),
    display: () => node.value?.items,
    items: getSubMenuData.value,
  },
  {
    type: 'button',
    text: '复制',
    icon: markRaw(CopyOutlined),
    display: () => !isRoot.value,
    handler: () => {
      node.value && services?.designerService.copy(node.value);
    },
  },
  {
    type: 'button',
    text: '删除',
    icon: markRaw(DeleteOutlined),
    display: () => !isRoot.value && !isPage.value,
    handler: () => {
      node.value && services?.designerService.remove(node.value);
    },
  },
  ...layerContentMenu,
]);

defineExpose({
  show(e: MouseEvent) {
    menu.value?.show(e);
  },
});
</script>

<template>
  <ContentMenu ref="menu" :menu-data="menuData" style="overflow: initial" />
</template>
