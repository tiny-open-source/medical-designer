<script lang="ts" setup>
import type { FieldsetConfig, FormState } from '../schema';

import { NCheckbox } from 'naive-ui';
import { computed, inject, watch } from 'vue';

defineOptions({
  name: 'l-form-fieldset',
});

const props = withDefaults(
  defineProps<{
    labelWidth?: string;
    prop: string;
    size?: string;
    model: Record<string, any>;
    config: FieldsetConfig;
    rules?: any;
  }>(),
  {
    rules: {},
    prop: '',
  },
);

const emit = defineEmits(['change']);

const lForm = inject<FormState | undefined>('lForm');

const name = computed(() => props.config.name || '');

const show = computed(() => {
  if (props.config.expand && name.value) {
    return props.model[name.value]?.value;
  }
  return true;
});

const lWidth = computed(() => {
  if (props.config.items) {
    return props.config.labelWidth || props.labelWidth;
  }
  return props.config.labelWidth || props.labelWidth || (props.config.text ? null : '0');
});

function change() {
  emit('change', props.model);
}

const key = (item: any, index: number) => item[lForm?.keyProp || '__key'] ?? index;

if (props.config.checkbox && name.value) {
  watch(
    () => props.model[name.value]?.value,
    () => {
      emit('change', props.model);
    },
  );
}
</script>

<template>
  <fieldset
    v-if="name ? model[name] : model"
    class="l-fieldset"
    :style="show ? 'padding: 15px 15px 0 5px;' : 'border: 0'"
  >
    <component :is="!show ? 'div' : 'legend'" v-if="name && config.checkbox">
      <NCheckbox
        v-model:checked="
          //eslint-disable-next-line vue/no-mutating-props
          model[name].value"
        :prop="`${prop}${prop ? '.' : ''}${config.name}.value`"
        :true-label="1"
        :false-label="0"
      >
        <span v-html="config.legend" /><span v-if="config.extra" class="l-form-tip" v-html="config.extra" />
      </NCheckbox>
    </component>
    <legend v-else>
      <span v-html="config.legend" />
      <span v-if="config.extra" class="l-form-tip" v-html="config.extra" />
    </legend>
    <div v-if="config.schematic && show" style="display: flex">
      <div style="flex: 1">
        <l-form-container
          v-for="(item, index) in config.items"
          :key="key(item, index)"
          :model="name ? model[name] : model"
          :rules="name ? rules[name] : []"
          :config="item"
          :prop="prop"
          :label-width="lWidth"
          :size="size"
          @change="change"
        />
      </div>

      <img class="m-form-schematic" :src="config.schematic">
    </div>

    <template v-else-if="show">
      <l-form-container
        v-for="(item, index) in config.items"
        :key="key(item, index)"
        :model="name ? model[name] : model"
        :rules="name ? rules[name] : []"
        :config="item"
        :prop="prop"
        :label-width="lWidth"
        :size="size"
        @change="change"
      />
    </template>
  </fieldset>
</template>
