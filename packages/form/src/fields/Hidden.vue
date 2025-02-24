<script setup lang="ts">
import type { PropType } from 'vue';
import type { HiddenConfig } from '../schema';
import { computed } from 'vue';
import fieldProps from '../utils/fieldProps';

defineOptions({
  name: 'l-fields-hidden',
});
const props = defineProps({
  ...fieldProps,
  config: {
    type: Object as PropType<HiddenConfig>,
    required: true,
  },
});
const n = computed(() => props.name || props.config.name || '');
</script>

<template>
  <input v-if="model" v-model="model[n]" type="hidden">
</template>
