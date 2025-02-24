<script setup lang="ts">
import type { PropType } from 'vue';
import type { DisplayConfig } from '../schema';
import { computed } from 'vue';
import fieldProps from '../utils/fieldProps';

defineOptions({
  name: 'l-fields-display',
});
const props = defineProps({
  ...fieldProps,
  config: {
    type: Object as PropType<DisplayConfig>,
    required: true,
  },
});
const n = computed(() => props.name || props.config.name || '');

if (props.config.initValue && n.value && props.model) {
  // eslint-disable-next-line vue/no-mutating-props
  props.model[n.value] = props.config.initValue;
}
</script>

<template>
  <span v-if="model">{{ model[n] }}</span>
</template>
