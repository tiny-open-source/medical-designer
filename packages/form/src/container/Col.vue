<script setup lang="ts">
import type { PropType } from 'vue';
import type { ChildConfig, FormState } from '../schema';
import { computed, inject } from 'vue';
import { display as displayFunction } from '../utils/form';

defineOptions({
  name: 'LFormCol',
});
const props = defineProps({
  labelWidth: String,
  expandMore: Boolean,
  span: Number,
  model: {
    type: Object,
    default: () => ({}),
  },

  config: {
    type: Object as PropType<ChildConfig>,
    default: () => ({}),
  },

  prop: String,

  size: String,
});
const emit = defineEmits(['change']);
const lForm = inject<FormState | undefined>('lForm');

const changeHandler = () => emit('change', props.model);
const display = computed(() => displayFunction(lForm, props.config.display, props));
</script>

<template>
  <LFormContainer
    v-show="display && config.type !== 'hidden'"
    :model="model"
    :config="config"
    :prop="prop"
    :label-width="config.labelWidth || labelWidth"
    :expand-more="expandMore"
    :size="size"
    @change="changeHandler"
  />
</template>
