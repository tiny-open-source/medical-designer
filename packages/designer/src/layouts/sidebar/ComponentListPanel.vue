<script setup lang="ts">
import type { ComponentGroup, ComponentItem, Services, StageOptions } from '../../type';
import { removeClassNameByClassName } from '@lowcode/utils';
import { SearchOutlined } from '@vicons/antd';
import { NCollapse, NCollapseItem, NIcon, NInput, NScrollbar } from 'naive-ui';

import serialize from 'serialize-javascript';
import { computed, inject, ref } from 'vue';
import MIcon from '../../components/Icon.vue';

defineOptions({
  name: 'ComponentListPanel',
});
const searchText = ref('');
const services = inject<Services>('services');
const stageOptions = inject<StageOptions>('stageOptions');

const stage = computed(() => services?.designerService.get('stage'));
const list = computed(() =>
  services?.componentListService.getList().map((group: ComponentGroup) => ({
    ...group,
    items: group.items.filter((item: ComponentItem) => item.text.includes(searchText.value)),
  })),
);
const collapseValue = computed(() =>
  Array.from({ length: list.value?.length || 0 })
    .fill(1)
    .map((x, i) => i),
);
function appendComponent({ text, type, data = {} }: ComponentItem): void {
  services?.designerService.add({
    name: text,
    type,
    ...data,
  });
}

function dragstartHandler({ text, type, data = {} }: ComponentItem, event: DragEvent): void {
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData(
      'data',
      serialize({
        name: text,
        type,
        ...data,
      }).replace(/"(\w+)":\s/g, '$1: '),
    );
  }
}

let timeout: NodeJS.Timeout | undefined;
let clientX: number;
let clientY: number;

function dragendHandler() {
  if (timeout) {
    globalThis.clearTimeout(timeout);
    timeout = undefined;
  }
  const doc = stage.value?.renderer.contentWindow?.document;
  if (doc && stageOptions) {
    removeClassNameByClassName(doc, stageOptions.containerHighlightClassName);
  }
  clientX = 0;
  clientY = 0;
}

function dragHandler(e: DragEvent) {
  if (e.clientX !== clientX || e.clientY !== clientY) {
    clientX = e.clientX;
    clientY = e.clientY;
    if (timeout) {
      globalThis.clearTimeout(timeout);
      timeout = undefined;
    }
    return;
  }

  if (timeout || !stage.value)
    return;

  timeout = stage.value.getAddContainerHighlightClassNameTimeout(e);
}
</script>

<template>
  <NScrollbar>
    <slot name="component-list-panel-header" />
    <NCollapse class="ui-component-panel" :model-value="collapseValue" arrow-placement="right" :default-expanded-names="list!.map(i => i.title)">
      <div
        class="search-input"
      >
        <NInput
          v-model:value="searchText"
          placeholder="输入关键字进行过滤"
          size="tiny"
          clearable
        >
          <template #prefix>
            <NIcon :component="SearchOutlined" />
          </template>
        </NInput>
      </div>
      <template v-for="(group, index) in list">
        <NCollapseItem v-if="group.items && group.items.length" :key="index" :name="group.title" :title="group.title">
          <template #header>
            {{ group.title }}
          </template>
          <div
            v-for="item in group.items"
            :key="item.type"
            class="component-item"
            draggable="true"
            @click="appendComponent(item)"
            @dragstart="dragstartHandler(item, $event)"
            @dragend="dragendHandler"
            @drag="dragHandler"
          >
            <MIcon :icon="item.icon" />
            <span>{{ item.text }}</span>
          </div>
        </NCollapseItem>
      </template>
    </NCollapse>
  </NScrollbar>
</template>

<style lang="scss" scoped></style>
