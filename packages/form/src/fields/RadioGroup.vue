<script setup lang="ts">
import type { PropType } from 'vue';
import { NButton, NIcon, NRadioButton, NRadioGroup, NTooltip } from 'naive-ui';
import { computed } from 'vue';
import fieldProps from '../utils/fieldProps';
import { useAddField } from '../utils/useAddField';

defineOptions({
  name: 'LFieldsRadioGroup',
});
const props = defineProps({
  ...fieldProps,
  size: {
    type: String as PropType<'small' | 'medium' | 'large' | undefined>,
    default: 'medium',
  },
  config: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(['change', 'input']);
useAddField(props.prop);

const modelName = computed(() => props.name || props.config.name || '');

const modelValue = computed({
  get: () => props.model[modelName.value],
  set: (value) => {
    emit('change', value);
  },
});
</script>

<template>
  <NRadioGroup v-if="model" v-model:value="modelValue" class="radio-group" :size="size" name="radiobuttongroup1">
    <NTooltip
      v-for="option in config.options"
      :key="option.value"
      trigger="hover"
      placement="top"
    >
      <template #trigger>
        <NRadioButton
          :key="option.value"
          :value="option.value"
          :label="option.text"
          style="line-height: 34px;"
          @change.stop
        >
          <NIcon v-if="option.icon">
            <component :is="option.icon" />
          </NIcon>
          <span>{{ option.text }}</span>
        </NRadioButton>
      </template>
      {{ option?.tooltip }}
    </NTooltip>
  </NRadioGroup>
</template>

<style lang="scss" scoped>
.radio-group {
  & ::v-deep(.n-radio-button--checked) {
    background: var(--n-button-text-color-active);
    color: var(--n-button-color-active);
    border-color: var(--n-button-border-color-active);
  }
}
</style>
