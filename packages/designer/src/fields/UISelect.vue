<script setup lang="ts" name="UISelect">
import type { FormState } from '@low-code/form';
import type { Services } from '../type';
import { DeleteOutlined } from '@vicons/antd';

import { NButton, NIcon, NTooltip } from 'naive-ui';
import { computed, inject, ref } from 'vue';

defineOptions({
  name: 'l-fields-ui-select',
});
const props = withDefaults(defineProps<{
  model: Record<string, any>;
  name: string;
  prop: string;
}>(), {
  model: () => ({}),
  name: '',
  prop: '',
});
const emit = defineEmits(['change']);

const uiSelectMode = ref(false);
const services = inject<Services>('services');
const lForm = inject<FormState>('lForm');
const val = computed(() => props.model[props.name]);
function deleteHandler() {
  if (props.model) {
    // eslint-disable-next-line vue/no-mutating-props
    props.model[props.name] = '';
    emit('change', '');
    lForm?.$emit('fieldChange', props.prop, '');
  }
}
function cancelHandler() {
  if (!services?.uiService)
    return;
  services.uiService.set<boolean>('uiSelectMode', false);
  uiSelectMode.value = false;
  globalThis.document.removeEventListener('ui-select', clickHandler as EventListener);
}
function clickHandler({ detail }: Event & { detail: any }) {
  if (detail.id) {
    // eslint-disable-next-line vue/no-mutating-props
    props.model[props.name] = detail.id;
    emit('change', detail.id);
    lForm?.$emit('fieldChange', props.prop, detail.id);
  }

  if (cancelHandler) {
    cancelHandler();
  }
}
function startSelect() {
  if (!services?.uiService)
    return;
  services.uiService.set<boolean>('uiSelectMode', true);

  uiSelectMode.value = true;
  globalThis.document.addEventListener('ui-select', clickHandler as EventListener);
}

const toName = computed(() => {
  const config = services?.designerService.getNodeById(val.value);
  return config?.name || '';
});
</script>

<template>
  <div v-if="uiSelectMode" class="l-fields-ui-select" @click="cancelHandler">
    <NButton type="error" text style="padding: 0">
      <template #icon>
        <NIcon>
          <DeleteOutlined />
        </NIcon>
      </template>
      取消
    </NButton>
  </div>
  <div v-else class="l-fields-ui-select" style="display: flex" @click="startSelect">
    <NTooltip v-if="val" trigger="hover">
      <template #trigger>
        <NButton text type="primary" @click.stop="deleteHandler">
          <NIcon>
            <DeleteOutlined />
          </NIcon>
        </NButton>
      </template>
      清除
    </NTooltip>
    <NTooltip trigger="hover">
      <template #trigger>
        <NButton text type="primary">
          {{ val ? `${toName}_${val}` : '点击此处选择' }}
        </NButton>
      </template>
      {{ val ? `${toName}_${val}` : '点击此处选择' }}
    </NTooltip>
  </div>
</template>
