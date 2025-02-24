<script setup lang="ts">
import type { StyleSchema } from '@lowcode/schema';
import { LFormContainer } from '@lowcode/form';

const props = defineProps<{
  values: Partial<StyleSchema>;
}>();
const emit = defineEmits(['change']);
const config = {
  type: '',
  items: [
    {
      name: 'position',
      text: '定位',
      labelWidth: '68px',
      type: 'select',
      options: ['static', 'relative', 'absolute', 'fixed', 'sticky'].map(item => ({
        value: item,
        text: item,
      })),
    },
    {
      type: 'row',
      labelWidth: '68px',
      display: () => props.values.position !== 'static',
      items: [
        {
          name: 'left',
          text: 'left',
          type: 'number',
        },
        {
          name: 'top',
          text: 'top',
          type: 'number',
        },
      ],
    },
    {
      type: 'row',
      labelWidth: '68px',
      display: () => props.values.position !== 'static',
      items: [
        {
          name: 'right',
          text: 'right',
          type: 'number',
        },
        {
          name: 'bottom',
          text: 'bottom',
          type: 'number',
        },
      ],
    },
    {
      labelWidth: '68px',
      name: 'zIndex',
      text: 'zIndex',
      type: 'number',
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
