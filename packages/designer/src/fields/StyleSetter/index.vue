<script setup lang="ts">
import type { StyleSchema } from '@low-code/schema';
import { NCollapse, NCollapseItem } from 'naive-ui';
import { Background, Border, Font, Layout, Position } from './pro';

defineOptions({
  name: 'l-form-style-setter',
});
withDefaults(defineProps<{
  config: StyleSchema;
  model: any;
  initValues?: any;
  values?: any;
  name: string;
  prop: string;
  disabled?: boolean;
  size?: 'large' | 'default' | 'small';
  lastValues?: Record<string, any>;
}>(), {});
const emit = defineEmits(['change']);
const list = [
  {
    name: 'layout',
    title: '布局',
    component: Layout,
  },
  {
    name: 'position',
    title: '位置',
    component: Position,
  },
  {
    name: 'background',
    title: '背景',
    component: Background,
  },
  {
    name: 'font',
    title: '文字',
    component: Font,
  },
  {
    name: 'border',
    title: '边框与圆角',
    component: Border,
  },
];

function change(v: any, name?: string) {
  emit('change', v, name);
}
</script>

<template>
  <NCollapse :default-expanded-names="list.map((item) => item.name!)">
    <NCollapseItem v-for="(item, index) in list" :key="index" :title="item.title" :name="item.name">
      <component :is="item.component" :values="model[name]" @change="change" />
    </NCollapseItem>
  </NCollapse>
</template>

<style lang="scss" scoped></style>
