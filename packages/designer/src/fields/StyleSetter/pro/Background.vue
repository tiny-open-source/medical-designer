<script setup lang="ts">
import type { StyleSchema } from '@low-code/schema';
import { LFormContainer } from '@low-code/form';
import { markRaw } from 'vue';
import { BackgroundNoRepeat, BackgroundRepeat, BackgroundRepeatX, BackgroundRepeatY } from '../icons/background-repeat';

defineProps<{
  values: Partial<StyleSchema>;
}>();
const emit = defineEmits(['change']);
const config = {
  type: '',
  items: [
    {
      name: 'backgroundColor',
      text: '背景色',
      labelWidth: '68px',
      type: 'colorPicker',
    },
    {
      name: 'backgroundImage',
      text: '背景图',
      labelWidth: '68px',
      type: 'img-upload',
    },
    {
      name: 'backgroundSize',
      text: '背景尺寸',
      type: 'radioGroup',
      childType: 'button',
      labelWidth: '68px',
      options: [
        { value: 'auto', text: '默认', tooltip: '默认 auto' },
        { value: 'contain', text: '等比填充', tooltip: '等比填充 contain' },
        { value: 'cover', text: '等比覆盖', tooltip: '等比覆盖 cover' },
      ],
    },
    {
      name: 'backgroundRepeat',
      text: '重复显示',
      type: 'radioGroup',
      childType: 'button',
      labelWidth: '68px',
      options: [
        { value: 'repeat', icon: markRaw(BackgroundRepeat), tooltip: '垂直和水平方向重复 repeat' },
        { value: 'repeat-x', icon: markRaw(BackgroundRepeatX), tooltip: '水平方向重复 repeat-x' },
        { value: 'repeat-y', icon: markRaw(BackgroundRepeatY), tooltip: '垂直方向重复 repeat-y' },
        { value: 'no-repeat', icon: markRaw(BackgroundNoRepeat), tooltip: '不重复 no-repeat' },
      ],
    },
  ],
};
function change(value: string | StyleSchema) {
  emit('change', value);
}
</script>

<template>
  <LFormContainer :config="config" :model="values" @change="change" />
</template>

<style lang="scss" scoped></style>
