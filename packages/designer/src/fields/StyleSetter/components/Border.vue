<script lang="ts" setup>
import type { FormValue } from '@lowcode/form';

import type { StyleSchema } from '@lowcode/schema';
import { LFormContainer } from '@lowcode/form';
import { computed, ref } from 'vue';

withDefaults(
  defineProps<{
    model: FormValue;
  }>(),
  {},
);

const emit = defineEmits(['change']);

const direction = ref('');

const config = computed(() => ({
  type: '',
  items: [
    {
      name: `border${direction.value}Width`,
      text: '边框宽度',
      type: 'number',
      labelWidth: '68px',
    },
    {
      name: `border${direction.value}Color`,
      text: '边框颜色',
      labelWidth: '68px',
      type: 'colorPicker',
    },
    {
      name: `border${direction.value}Style`,
      text: '边框样式',
      labelWidth: '68px',
      type: 'select',
      options: ['solid', 'dashed', 'dotted'].map(item => ({
        value: item,
        text: item,
      })),
    },
  ],
}));

const selectDirection = (d?: string) => (direction.value = d || '');

function change(value: StyleSchema, name?: string) {
  emit('change', value, name);
}
</script>

<template>
  <div class="border-box-container">
    <div class="border-icon-container">
      <div class="border-icon-container-row">
        <div
          class="border-icon border-icon-top"
          :class="{ active: direction === 'Top' }"
          @click="selectDirection('Top')"
        />
      </div>
      <div class="border-icon-container-row">
        <div
          class="border-icon border-icon-left"
          :class="{ active: direction === 'Left' }"
          @click="selectDirection('Left')"
        />
        <div class="border-icon" :class="{ active: direction === '' }" @click="selectDirection()" />
        <div
          class="border-icon border-icon-right"
          :class="{ active: direction === 'Right' }"
          @click="selectDirection('Right')"
        />
      </div>
      <div class="border-icon-container-row">
        <div
          class="border-icon border-icon-bottom"
          :class="{ active: direction === 'Bottom' }"
          @click="selectDirection('Bottom')"
        />
      </div>
    </div>
    <div class="border-value-container">
      <LFormContainer :config="config" :model="model" @change="change" />
    </div>
  </div>
</template>
