<script setup lang="ts">
import type { StyleSchema } from '@low-code/schema';
import { LFormContainer } from '@low-code/form';
import { RadiusBottomleftOutlined, RadiusBottomrightOutlined, RadiusUpleftOutlined, RadiusUprightOutlined } from '@vicons/antd';
import { markRaw } from 'vue';
import Border from '../components/Border.vue';

defineProps<{
  values: Partial<StyleSchema>;
}>();
const emit = defineEmits(['change']);
const config = {
  type: '',
  items: [
    {
      type: 'row',
      items: [
        {
          labelWidth: '68px',
          name: 'borderTopLeftRadius',
          labelIcon: markRaw(RadiusUpleftOutlined),
          type: 'number',
          text: '左上圆角',
        },
        {
          labelWidth: '68px',
          name: 'borderTopRightRadius',
          labelIcon: markRaw(RadiusUprightOutlined),
          type: 'number',
          text: '右上圆角',
        },
      ],
    },
    {
      type: 'row',
      items: [
        {
          labelWidth: '68px',
          name: 'borderBottomLeftRadius',
          labelIcon: markRaw(RadiusBottomleftOutlined),
          text: '左下圆角',
          type: 'number',
        },
        {
          labelWidth: '68px',
          name: 'borderBottomRightRadius',
          labelIcon: markRaw(RadiusBottomrightOutlined),
          text: '右下圆角',
          type: 'number',
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
  <Border :model="values" @change="change" />
</template>
