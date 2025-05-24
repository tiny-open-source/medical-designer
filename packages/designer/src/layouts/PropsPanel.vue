<script lang="ts" setup>
import type { FormConfig, FormValue, LForm } from '@low-code/form';

import type { Services } from '../type';
import { computed, getCurrentInstance, inject, onMounted, ref, watchEffect } from 'vue';

defineOptions({
  name: 'PropsPanel',
});
const emit = defineEmits(['mounted']);

const internalInstance = getCurrentInstance();
const currentSelectedElFormValues = ref<FormValue>({});
const configForm = ref<InstanceType<typeof LForm>>();
const currentSelectedElFormConfig = ref<FormConfig>();
const services = inject<Services>('services');
const node = computed(() => services?.designerService.get('node'));
const propsPanelSize = computed(() => services?.uiService.get('propsPanelSize') || 'small');
const stage = computed(() => services?.designerService.get('stage'));

async function init() {
  if (!node.value) {
    currentSelectedElFormConfig.value = [];
    return;
  }
  // 先判断是容器还是纯文本
  const type = node.value.type || (node.value.items ? 'container' : 'text');
  currentSelectedElFormConfig.value = (await services?.propsService.getPropsConfig(type)) || [];
  currentSelectedElFormValues.value = node.value;
}

watchEffect(init);
services?.propsService.on('props-configs-change', init);

onMounted(() => {
  emit('mounted', internalInstance);
});

watchEffect(() => {
  if (configForm.value && stage.value) {
    configForm.value.formState.stage = stage.value;
  }
});

async function submit() {
  try {
    const values = await configForm.value?.submitForm();
    services?.designerService.update(values);
  }
  catch (e: any) {
    console.error(e);
  }
}

defineExpose({ submit });
</script>

<template>
  <LForm
    ref="configForm"
    :class="`lc-d-props-panel ${propsPanelSize}`"
    :popper-class="`lc-d-props-panel-popper ${propsPanelSize}`"
    :size="propsPanelSize"
    :init-values="currentSelectedElFormValues"
    :config="currentSelectedElFormConfig"
    @change="submit"
  />
</template>
