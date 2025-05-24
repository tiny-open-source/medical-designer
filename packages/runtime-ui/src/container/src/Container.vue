<script setup lang="ts">
import type { MPage } from '@low-code/schema';
import { computed } from 'vue';
import LowCodeRuntimeUiComponent from '../../Component.vue';
import { useApp } from '../../use-app';

const props = defineProps<{
  config: MPage;
}>();

const app = useApp(props);

const style = app?.transformStyle(props.config.style || {});

// const commonMethod = useCommonMethod(props);
const display = computed(() => {
  const displayCfg = props.config?.display;
  if (typeof displayCfg === 'function') {
    return displayCfg(app);
  }
  return displayCfg !== false;
});
</script>

<template>
  <div
    v-if="display"
    :id="`${config.id || ''}`"
    :class="`low-code-ui-container low-code-layout-${config.className ? ` ${config.className}` : ''}`"
    :style="style"
  >
    <slot />
    <LowCodeRuntimeUiComponent v-for="item in config.items" :key="item.id" :config="item" />
  </div>
</template>
