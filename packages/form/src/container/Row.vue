<script setup lang="ts">
import type { FormState, RowConfig } from '../schema';
import { NButton, NFlex } from 'naive-ui';
import { inject, type PropType } from 'vue';
import Col from './Col.vue';

defineOptions({
  name: 'LFormRow',
});
const props = defineProps({
  labelWidth: String,
  expandMore: Boolean,
  model: {
    type: Object,
    default: () => ({}),
  },
  config: {
    type: Object as PropType<RowConfig>,
    default: () => ({}),
  },
  prop: String,
  name: String,
  size: String,
});

const emit = defineEmits(['change']);
const lForm = inject<FormState | undefined>('lForm');

const changeHandler = () => emit('change', props.name ? props.model[props.name] : props.model);
</script>

<template>
  <NFlex :wrap="false">
    <Col
      v-for="(col, index) in config.items"
      :key="col[lForm?.keyProp || '__key'] ?? index"
      :span="col.span || config.span || 24 / config.items.length"
      :config="col"
      :label-width="config.labelWidth || labelWidth"
      :expand-more="expandMore"
      :model="name ? model[name] : model"
      :prop="prop"
      :size="size"
      @change="changeHandler"
    />
  </NFlex>
</template>
