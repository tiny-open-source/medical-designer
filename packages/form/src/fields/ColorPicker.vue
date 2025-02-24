<script setup lang="ts">
import type { PropType } from 'vue';
import type { HiddenConfig } from '../schema';
import { NColorPicker } from 'naive-ui';
import { computed, ref } from 'vue';
import fieldProps from '../utils/fieldProps';

defineOptions({
  name: 'l-fields-color-picker',
});
const props = defineProps({
  ...fieldProps,
  config: {
    type: Object as PropType<HiddenConfig>,
    required: true,
  },
});
const emit = defineEmits(['change']);
const modelName = computed(() => props.name || props.config.name || '');

const modelValue = computed({
  get: () => props.model[modelName.value],
  set: (value) => {
    emit('change', value);
  },
});
</script>

<template>
  <NColorPicker v-if="model" v-model:value="modelValue" />
</template>
