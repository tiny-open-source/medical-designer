<script setup lang="ts">
import type { MButton, MButtonInstance, MText } from '../../type';
import { computed, getCurrentInstance, reactive } from 'vue';
import { useApp } from '../../use-app';

const props = withDefaults(defineProps<{
  config?: MButton;
  model?: Record<string, any>;
}>(), {
  model: () => ({}),
  config: () => ({
    type: 'button',
  }),
});

useApp(props);

const vm: MButtonInstance = getCurrentInstance()?.proxy as MButtonInstance;

const actions = reactive<(() => any)[]>([]);
const actualActions = computed(() => [
  typeof props.config.preAction === 'function' ? props.config.preAction : () => true,
  ...actions,
  typeof props.config.postAction === 'function' ? props.config.postAction : () => true,
]);
function pushAction(action: (() => any)): void {
  actions.push(action);
}
async function clickHandler(): Promise<void> {
  for (const fn of actualActions.value) {
    if (typeof fn === 'function') {
      const ret = await fn(vm, { model: props.model });
      if (ret === false) {
        break;
      }
    }
  }
}

const textConfig = computed<MText>(() => ({
  type: 'text',
  text: props.config?.text || '',
  disabledText: props.config?.disabledText || '',
  html: props.config?.html || '',
}));

defineExpose({
  pushAction,
});
</script>

<template>
  <button class="low-code-ui-button" @click="clickHandler">
    <slot>
      <low-code-runtime-ui-text :config="textConfig" />
    </slot>
  </button>
</template>
