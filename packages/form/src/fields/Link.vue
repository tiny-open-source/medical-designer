<script setup lang="ts">
import type { PropType } from 'vue';
import type Dialog from '../Dialog.vue';
import type { FormState, LinkConfig } from '../schema';
import { NButton } from 'naive-ui';
import { computed, inject, ref } from 'vue';
import fieldProps from '../utils/fieldProps';

defineOptions({
  name: 'l-fields-link',
});
const props = defineProps({
  ...fieldProps,
  labelWidth: String,
  config: {
    type: Object as PropType<LinkConfig>,
    required: true,
  },
});
const emit = defineEmits(['change']);
const lForm = inject<FormState | undefined>('lForm');
const editor = ref<InstanceType<typeof Dialog>>();

const formValue = ref({});

const href = computed(() => {
  if (typeof props.config.href === 'function' && props.model) {
    return props.config.href(props.model);
  }
  return props.config.href || props.model?.[props.name];
});
const formConfig = computed(() => {
  if (typeof props.config.form === 'function') {
    return props.config.form(lForm, {
      model: props.model || {},
      values: props.values || {},
    });
  }
  return props.config.form;
});

const disabled = computed(() => {
  if (typeof props.config.disabled !== 'undefined') {
    return props.config.disabled;
  }
  return !href.value;
});

const displayText = computed(() => {
  if (typeof props.config.displayText === 'function') {
    return props.config.displayText(lForm, { model: props.model || {} });
  }
  if (props.config.displayText) {
    return props.config.displayText;
  }
  return '跳转';
});

function editHandler() {
  init();
  editor.value?.create();
}

function init() {
  formValue.value = props.model?.[props.name] || {};
}
function action(data: any) {
  if (props.model) {
    // eslint-disable-next-line vue/no-mutating-props
    props.model[props.name] = data;
    formValue.value = data;
    emit('change', props.model[props.name]);
  }
  editor.value?.cancel();
}
</script>

<template>
  <a v-if="config.href && !disabled" target="_blank" :href="href" :style="config.css || {}">{{ displayText }}</a>
  <span v-else-if="config.href && disabled" :style="config.disabledCss || {}">{{ displayText }}</span>
  <div v-else class="l-fields-link">
    <NButton text type="primary" @click="editHandler">
      点击编辑
    </NButton>
    <l-form-dialog
      ref="editor"
      :title="config.formTitle || '编辑扩展配置'"
      :width="config.formWidth"
      :values="formValue"
      :config="formConfig"
      :parent-values="values"
      :fullscreen="config.fullscreen"
      :label-width="labelWidth"
      @submit="action"
    />
  </div>
</template>
