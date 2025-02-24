<script setup lang="ts">
import type { PropType } from 'vue';
import type { FormState, TextConfig } from '../schema';
import { NInput } from 'naive-ui';
import { computed, inject } from 'vue';
import fieldProps from '../utils/fieldProps';

defineOptions({
  name: 'l-fields-text',
});
const props = defineProps({
  ...fieldProps,
  config: {
    type: Object as PropType<TextConfig>,
    required: true,
  },
});
const emit = defineEmits(['change', 'input']);
// const lForm = inject<FormState | undefined>('lForm');
const modelName = computed(() => props.name || props.config.name || '');

function inputHandler(value: string | [string, string]) {
  emit('input', modelName, value);
  // lForm?.$emit('fieldInput', props.prop, value);
}
const modelValue = computed({
  get: () => props.model[modelName.value],
  set: (value) => {
    emit('change', value);
  },
});
</script>

<template>
  <NInput v-model:value="modelValue" type="text" clearable :placeholder="config.placeholder" @input="inputHandler" />
</template>
