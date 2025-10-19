<script setup lang="ts" name="LForm">
import type { FormConfig, FormState, FormValue } from './schema';
import { cloneDeep } from 'lodash-es';
import { NForm } from 'naive-ui';
import { provide, reactive, ref, toRaw, watch } from 'vue';
import { initValue } from './utils/form';

export interface ValidateError {
  message: string;
  field: string;
}
defineOptions({
  name: 'LForm',
});
const props = withDefaults(defineProps<{
  initValues?: Record<string, any>;
  parentValues?: Record<string, any>;
  config?: FormConfig;

  labelWidth?: string;
  labelIcon?: string;
  disabled?: boolean;

  height?: string;

  stepActive?: number | string;
  size?: 'small' | 'default' | 'large';
  layout?: 'horizontal' | 'vertical' | 'inline';
  labelPosition?: 'left' | 'right';
  keyProp?: string;
  popperClass?: string;
}>(), {
  initValues: () => ({}),
  parentValues: () => ({}),
  config: () => [],
  labelWidth: '100',
  disabled: false,
  height: 'auto',
  stepActive: 1,

  size: 'default',
  layout: 'horizontal',
  labelPosition: 'right',
  keyProp: '__key',
  popperClass: '',
});
const emit = defineEmits(['change', 'field-input', 'field-change']);
const formRef = ref();

const initialized = ref(false);
const values = ref<FormValue>({});
const fields = new Map<string, any>();
const formState: FormState = reactive<FormState>({
  keyProp: props.keyProp,
  popperClass: props.popperClass,
  config: props.config,
  initValues: props.initValues,
  parentValues: props.parentValues,
  values,
  $emit: emit as (event: string, ...args: any[]) => void,
  fields,
  setField: (prop: string, field: any) => fields.set(prop, field),
  getField: (prop: string) => fields.get(prop),
  deleteField: (prop: string) => fields.delete(prop),
  post: () => {
    // TODO
  },
});

function changeHandler() {
  emit('change', values.value);
}
provide('lForm', formState);
watch(
  [() => props.config, () => props.initValues],
  (
    // [config], [preConfig]
  ) => {
    // console.log('🚀 ~ preConfig:', preConfig);
    // console.log('🚀 ~ config:', config);
    // if (!isEqual(toRaw(config), toRaw(preConfig))) {
    //   initialized.value = false;
    // }

    initValue(formState, {
      initValues: props.initValues,
      config: props.config,
    }).then((value) => {
      values.value = value;
      initialized.value = true;
    });
  },
  { immediate: true },
);
defineExpose({
  formState,
  submitForm: async (native?: boolean): Promise<any> => {
    try {
      await formRef.value?.validate();

      return native ? values.value : cloneDeep(toRaw(values.value));
    }
    catch (invalidFields: any) {
      const error: string[] = [];

      Object.entries(invalidFields).forEach(([, ValidateError]) => {
        (ValidateError as ValidateError[]).forEach(({ field, message }) => {
          if (field && message)
            error.push(`${field} -> ${message}`);
          if (field && !message)
            error.push(`${field} -> 出现错误`);
          if (!field && message)
            error.push(`${message}`);
        });
      });
      throw new Error(error.join('<br>') || '表单校验失败');
    }
  },
});
</script>

<template>
  <div>
    <NForm
      ref="formRef" class="lc-f" :model="values" :label-width="labelWidth" :label-align="labelPosition" label-placement="left" :disabled="disabled" :layout="layout"
    >
      <template v-if="initialized && Array.isArray(config)">
        <LFormContainer
          v-for="(item, index) in config"
          :key="item[keyProp] ?? index"
          style="height: 100%;"
          :label-width="labelWidth"
          :config="item"
          :model="values"
          :label-icon="labelIcon"
          :size
          @change="changeHandler"
        />
      </template>
    </NForm>
  </div>
</template>
