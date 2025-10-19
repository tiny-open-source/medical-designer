<script setup lang="ts">
// @ts-nocheck
import type { SideBarData } from '../../type';
import { BlockOutlined, CheckSquareOutlined } from '@vicons/antd';
import { NTabPane, NTabs } from 'naive-ui';
import { computed, ref, watch } from 'vue';
import MIcon from '../../components/Icon.vue';
import ComponentListPanel from './ComponentListPanel.vue';
import LayerPanel from './LayerPanel.vue';

defineOptions({
  name: 'l-sidebar',
});

const props = withDefaults(defineProps<{
  data?: SideBarData;
}>(), {
  data: () => ({ type: 'tabs', status: '组件', items: ['component-list', 'layer', 'ai-layout'] }),
});

const activeTabName = ref(props.data?.status);
watch(
  () => props.data?.status,
  (status) => {
    activeTabName.value = status || '0';
  },
);
const dataConfigs = computed(() => {
  return props.data?.items.map((item) => {
    if (typeof item !== 'string') {
      return item;
    }

    switch (item) {
      case 'component-list':
        return {
          type: 'component',
          icon: BlockOutlined,
          text: '组件',
          component: ComponentListPanel,
          slots: {},
        };
      case 'layer':
        return {
          type: 'component',
          icon: CheckSquareOutlined,
          text: '树',
          component: LayerPanel,
          slots: {},
        };
      default:
        return undefined;
    }
  }).filter(Boolean) || [];
}) as any;
</script>

<template>
  <NTabs
    v-if="data.type === 'tabs' && data.items.length"
    v-model:value="activeTabName"
    class="lc-d-sidebar"
    size="small"
    animated
    placement="left"
    type="line"
    style="height: 100%;"
  >
    <NTabPane
      v-for="(config, index) in dataConfigs"
      :key="index" style="height: 100%;" :name="config.text" :tab="config.text"
    >
      <template #tab>
        <div :key="config.text">
          <MIcon v-if="config.icon" :icon="config.icon" />
          <div v-if="config.text" class="lc-d-tab-panel-title">
            {{ config.text }}
          </div>
        </div>
      </template>

      <component :is="config.component" v-bind="config.props || {}" v-on="config?.listeners || {}">
        <template v-if="config === 'layer'" #layer-panel>
          <slot name="layer-panel-header" />
        </template>

        <template v-if="config === 'component-list'" #component-list-panel>
          <slot name="component-list-panel-header" />
        </template>

        <template v-if="config.slots?.layerNodeContent" #layer-node-content="{ data: innerData, node }">
          <component :is="config.slots?.layerNodeContent" :data="innerData" :node="node" />
        </template>
      </component>
    </NTabPane>
  </NTabs>
</template>
