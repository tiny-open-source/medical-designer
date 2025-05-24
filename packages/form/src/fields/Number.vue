<script setup lang="ts">
import type { PropType } from 'vue';
import type { FormState, NumberConfig } from '../schema';
import { NInputNumber } from 'naive-ui';
import { computed, inject } from 'vue';
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

const emit = defineEmits(['change', 'input']);
const lForm = inject<FormState | undefined>('lForm');
const modelName = computed(() => props.name || props.config.name || '');

function inputHandler(value: number | null) {
  emit('input', modelName, value);
  lForm?.$emit('fieldInput', props.prop, value);
}
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
    clearable
    :disabled="disabled"
    @input="inputHandler"
  />
</template>
