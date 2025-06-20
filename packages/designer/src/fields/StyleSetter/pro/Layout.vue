<script setup lang="ts">
import type { FormState } from '@low-code/form';
import type { StyleSchema } from '@low-code/schema';
import { LFormContainer } from '@low-code/form';
import { markRaw } from 'vue';
import Box from '../components/Box.vue';
import { DisplayBlock, DisplayFlex, DisplayInline, DisplayInlineBlock, DisplayNone } from '../icons/display';
import {
  FlexDirectionColumn,
  FlexDirectionColumnReverse,
  FlexDirectionRow,
  FlexDirectionRowReverse,
} from '../icons/flex-direction';
import {
  JustifyContentCenter,
  JustifyContentFlexEnd,
  JustifyContentFlexStart,
  JustifyContentSpaceAround,
  JustifyContentSpaceBetween,
} from '../icons/justify-content';

defineProps<{
  values: Partial<StyleSchema>;
}>();
const emit = defineEmits(['change']);

const config = {
  type: 'form',
  items: [
    {
      name: 'display',
      text: '模式',
      type: 'radioGroup',
      childType: 'button',
      labelWidth: '68px',
      options: [
        { value: 'inline', icon: markRaw(DisplayInline), tooltip: '内联布局 inline' },
        { value: 'flex', icon: markRaw(DisplayFlex), tooltip: '弹性布局 flex' },
        { value: 'block', icon: markRaw(DisplayBlock), tooltip: '块级布局 block' },
        { value: 'inline-block', icon: markRaw(DisplayInlineBlock), tooltip: '内联块布局 inline-block' },
        { value: 'none', icon: markRaw(DisplayNone), tooltip: '隐藏 none' },
      ],
    },
    {
      name: 'flexDirection',
      text: '主轴方向',
      type: 'radioGroup',
      childType: 'button',
      labelWidth: '68px',
      options: [
        { value: 'row', icon: markRaw(FlexDirectionRow), tooltip: '水平方向 起点在左侧 row' },
        { value: 'row-reverse', icon: markRaw(FlexDirectionRowReverse), tooltip: '水平方向 起点在右侧 row-reverse' },
        { value: 'column', icon: markRaw(FlexDirectionColumn), tooltip: '垂直方向 起点在上沿 column' },
        {
          value: 'column-reverse',
          icon: markRaw(FlexDirectionColumnReverse),
          tooltip: '垂直方向 起点在下沿 column-reverse',
        },
      ],
      display: (mForm: FormState, { model }: { model: Record<any, any> }) => model.display === 'flex',
    },
    {
      name: 'justifyContent',
      text: '主轴对齐',
      type: 'radioGroup',
      childType: 'button',
      labelWidth: '68px',
      options: [
        { value: 'flex-start', icon: markRaw(JustifyContentFlexStart), tooltip: '左对齐 flex-start' },
        { value: 'flex-end', icon: markRaw(JustifyContentFlexEnd), tooltip: '右对齐 flex-end' },
        { value: 'center', icon: markRaw(JustifyContentCenter), tooltip: '居中 center' },
        { value: 'space-between', icon: markRaw(JustifyContentSpaceBetween), tooltip: '两端对齐 space-between' },
        { value: 'space-around', icon: markRaw(JustifyContentSpaceAround), tooltip: '横向平分 space-around' },
      ],
      display: (mForm: FormState, { model }: { model: Record<any, any> }) => model.display === 'flex',
    },
    {
      name: 'alignItems',
      text: '辅轴对齐',
      type: 'radioGroup',
      childType: 'button',
      labelWidth: '68px',
      options: [
        { value: 'flex-start', icon: markRaw(JustifyContentFlexStart), tooltip: '左对齐 flex-start' },
        { value: 'flex-end', icon: markRaw(JustifyContentFlexEnd), tooltip: '右对齐 flex-end' },
        { value: 'center', icon: markRaw(JustifyContentCenter), tooltip: '居中 center' },
        { value: 'space-between', icon: markRaw(JustifyContentSpaceBetween), tooltip: '两端对齐 space-between' },
        { value: 'space-around', icon: markRaw(JustifyContentSpaceAround), tooltip: '横向平分 space-around' },
      ],
      display: (mForm: FormState, { model }: { model: Record<any, any> }) => model.display === 'flex',
    },
    {
      name: 'flexWrap',
      text: '换行',
      type: 'radioGroup',
      childType: 'button',
      labelWidth: '68px',
      options: [
        { value: 'nowrap', text: '不换行', tooltip: '不换行 nowrap' },
        { value: 'wrap', text: '正换行', tooltip: '第一行在上方 wrap' },
        { value: 'wrap-reverse', text: '逆换行', tooltip: '第一行在下方 wrap-reverse' },
      ],
      display: (mForm: FormState, { model }: { model: Record<any, any> }) => model.display === 'flex',
    },
    {
      type: 'row',
      items: [
        {
          name: 'width',
          text: '宽度',
          type: 'number',
          labelWidth: '68px',
        },
        {
          name: 'height',
          text: '高度',
          type: 'number',
          labelWidth: '68px',
        },
      ],
    },
    {
      type: 'row',
      items: [
        {
          text: 'overflow',
          name: 'overflow',
          labelWidth: '68px',
          type: 'select',
          clearable: true,
          options: [
            { text: 'visible', value: 'visible' },
            { text: 'hidden', value: 'hidden' },
            { text: 'clip', value: 'clip' },
            { text: 'scroll', value: 'scroll' },
            { text: 'auto', value: 'auto' },
            { text: 'overlay', value: 'overlay' },
            { text: 'initial', value: 'initial' },
          ],
        },
        {
          text: '透明度',
          name: 'opacity',
          labelWidth: '68px',
        },
      ],
    },
  ],
};
function change(value: string | StyleSchema, name?: string) {
  emit('change', value, name);
}
</script>

<template>
  <LFormContainer :config="config" :model="values" @change="change" />
  <Box v-show="!['fixed', 'absolute'].includes(values.position)" :model="values" @change="change" />
</template>
