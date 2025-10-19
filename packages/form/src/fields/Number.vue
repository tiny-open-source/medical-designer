<script setup lang="ts">
import type { PropType } from 'vue';
import type { NumberConfig } from '../schema';
import { NInputNumber } from 'naive-ui';
import { computed } from 'vue';
import fieldProps from '../utils/fieldProps';

defineOptions({
  name: 'l-fields-number',
});
const props = defineProps({
  ...fieldProps,
  config: {
    type: Object as PropType<NumberConfig>,
    required: true,
  },
});

const emit = defineEmits(['change']);
const modelName = computed(() => props.name || props.config.name || '');

const modelValue = computed({
  get: () => Number(props.model[modelName.value]),
  set: (value) => {
    emit('change', value);
  },
});
</script>

<template>
  <NInputNumber
    v-model:value="modelValue"
    :step="config.step"
    :disabled="disabled"
    clearable
  />
</template>
