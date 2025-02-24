<script setup lang="ts">
import type { PropType } from 'vue';
import type { CheckboxConfig } from '../schema';
import { NCheckbox } from 'naive-ui';
import { computed } from 'vue';
import fieldProps from '../utils/fieldProps';

defineOptions({
  name: 'l-fields-checkbox',
});
const props = defineProps({
  ...fieldProps,
  config: {
    type: Object as PropType<CheckboxConfig>,
    required: true,
  },
});
const emit = defineEmits(['change', 'input']);
const modelName = computed(() => props.name || props.config.name || '');
const activeValue = computed(() => {
  if (typeof props.config.activeValue === 'undefined') {
    if (props.config.filter === 'number') {
      return 1;
    }
  }
  else {
    return props.config.activeValue;
  }

  return true;
});
const inactiveValue = computed(() => {
  if (typeof props.config.inactiveValue === 'undefined') {
    if (props.config.filter === 'number') {
      return 0;
    }
  }
  else {
    return props.config.inactiveValue;
  }

  return false;
});

const modelValue = computed({
  get: () => props.model[modelName.value],
  set: (value) => {
    emit('change', value);
  },
});
</script>

<template>
  <NCheckbox
    v-model:checked="modelValue"
    :checked-value="activeValue"
    :unchecked-value="inactiveValue"
    :disabled="disabled"
  >
    {{ config.text }}
  </NCheckbox>
</template>
