<script setup lang="ts">
import type { Id, MApp, MNode } from '@lowcode/schema';
import type { LowCode, RemoveData, UpdateData } from '@lowcode/stage';
import Core from '@lowcode/core';
import { getNodePath } from '@lowcode/utils';
import { computed, nextTick, provide, reactive, ref, watch } from 'vue';

declare global {
  interface Window {
    lowcode: LowCode;
  }
}

const root = ref<MApp>();

const curPageId = ref<Id>();

const selectedId = ref<Id>();

const pageConfig = computed(
  () => root.value?.items?.find((item: MNode) => item.id === curPageId.value) || root.value?.items?.[0],
);

const app = new Core({
  config: root.value,
  platform: 'designer',
});

provide('app', app);

watch(pageConfig, async () => {
  await nextTick();
  const page = document.querySelector<HTMLElement>('.lowcode-ui-page');
  page && window.lowcode.onPageElUpdate(page);
});

window.lowcode?.onRuntimeReady({
  getApp() {
    return app;
  },
  updateRootConfig(config: MApp) {
    console.log('update config', config);
    root.value = config;
  },
  updatePageId(id: Id) {
    console.log('update page id', id);
    curPageId.value = id;
    app?.setPage(id);
  },
  select(id: Id) {
    console.log('select config', id);
    selectedId.value = id;
    const el = document.getElementById(`${id}`);
    if (el)
      return el;
    return nextTick().then(() => document.getElementById(`${id}`) as HTMLElement);
  },
  add({ config, parentId }: UpdateData) {
    console.log('add config', config);

    if (!root.value)
      throw new Error('error');
    if (!selectedId.value)
      throw new Error('error');
    if (!parentId)
      throw new Error('error');

    const parent = getNodePath(parentId, [root.value]).pop();
    if (!parent)
      throw new Error('未找到父节点');
    if (parent.id !== selectedId.value) {
      const index = parent.items?.findIndex((child: MNode) => child.id === selectedId.value);
      parent.items?.splice(index + 1, 0, config);
    }
    else {
      // 新增节点添加到配置中
      parent.items?.push(config);
    }
  },

  update({ config, parentId }: UpdateData) {
    console.log('update config', config);

    if (!root.value)
      throw new Error('error');
    const node = getNodePath(config.id, [root.value]).pop();

    if (!parentId)
      throw new Error('error');
    const parent = getNodePath(parentId, [root.value]).pop();

    if (!node)
      throw new Error('未找到目标节点');
    if (!parent)
      throw new Error('未找到父节点');
    const index = parent.items?.findIndex((child: MNode) => child.id === node.id);
    parent.items.splice(index, 1, reactive(config));
  },

  remove({ id, parentId }: RemoveData) {
    if (!root.value)
      throw new Error('error');

    const node = getNodePath(id, [root.value]).pop();
    if (!node)
      throw new Error('未找到目标元素');

    const parent = getNodePath(parentId, [root.value]).pop();
    if (!parent)
      throw new Error('未找到父元素');

    const index = parent.items?.findIndex((child: MNode) => child.id === node.id);
    parent.items.splice(index, 1);
  },
});
</script>

<template>
  <transition name="fade" appear>
    <low-code-runtime-ui-page v-if="pageConfig" :config="pageConfig" />
  </transition>
</template>

<style lang="scss">
::-webkit-scrollbar {
  width: 0;
}
html,
body,
#app {
  width: 100%;
  height: 100%;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
#app {
  position: relative;
  overflow: auto;

}
</style>
