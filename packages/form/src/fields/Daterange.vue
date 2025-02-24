<script lang="ts" setup>
import type { DaterangeConfig } from '../schema';

import { datetimeFormatter } from '@lowcode/utils';
import { NDatePicker } from 'naive-ui';
import { ref, watch } from 'vue';
import { useAddField } from '../utils/useAddField';

defineOptions({
  name: 'l-fields-daterange',
});
const props = withDefaults(defineProps<{
  config: DaterangeConfig;
  model: any;
  initValues?: any;
  values?: any;
  name: string;
  prop: string;
  disabled?: boolean;
  size: 'small' | 'medium' | 'large';
}>(), {
  size: 'medium',
  disabled: false,
});

const emit = defineEmits(['change']);

useAddField(props.prop);

const { names } = props.config;
const value = ref<[number, number]>();

if (props.model !== undefined) {
  if (names?.length) {
    watch(
      [() => props.model[names[0]], () => props.model[names[1]]],
      ([start, end], [preStart, preEnd]) => {
        if (!value.value) {
          value.value = undefined;
        }
        if (!start || !end)
          value.value = undefined;
        if (start !== preStart)
          value.value![0] = new Date(start).getTime();
        if (end !== preEnd)
          value.value![1] = new Date(end).getTime();
      },
      {
        immediate: true,
      },
    );
  }
  else if (props.name && props.model[props.name]) {
    watch(
      () => props.model[props.name],
      (start, preStart) => {
        if (start !== preStart)
          value.value = start.map((item: string) => (item ? new Date(item) : undefined));
      },
      {
        immediate: true,
      },
    );
  }
}

function setValue(v: Date[] | Date) {
  names?.forEach((item, index) => {
    if (!props.model) {
      return;
    }
    if (Array.isArray(v)) {
      // eslint-disable-next-line vue/no-mutating-props
      props.model[item] = datetimeFormatter(v[index]?.toString(), '');
    }
    else {
      // eslint-disable-next-line vue/no-mutating-props
      props.model[item] = undefined;
    }
  });
}

function changeHandler(v: any[]) {
  const value = v || [];

  if (props.name) {
    emit(
      'change',
      value.map((item?: Date) => {
        if (item)
          return datetimeFormatter(item, '');
        return undefined;
      }),
    );
  }
  else {
    if (names?.length) {
      setValue(value);
    }
    emit('change', value);
  }
}
</script>

<template>
  <NDatePicker
    v-model:value="value"
    type="daterange"
    range-separator="-"
    start-placeholder="开始日期"
    end-placeholder="结束日期"
    clearable
    :size="size"
    :disabled="disabled"
    :default-time="config.defaultTime"
    @update:value="changeHandler"
  />
</template>
