<script setup lang="ts">
import type Core from '@low-code/core';
import type { MComponent } from '@low-code/schema';
import { computed, getCurrentInstance, inject, provide } from 'vue';

const props = defineProps<{
  config: MComponent;
}>();
const vm = getCurrentInstance()?.proxy;
const app: Core | undefined = inject('app');

provide('hoc', vm);

const tagName = computed(() => `low-code-runtime-ui-${props.config.type}`);
const style = computed(() => app?.transformStyle(props.config.style || {}));
const display = computed(() => {
  const displayCfg = props.config?.display;
  if (typeof displayCfg === 'function') {
    return displayCfg(app);
  }
  return displayCfg !== false;
});
</script>

<template>
  <component
    :is="tagName" v-if="display" :id="config.id" :style="style" :class="`low-code-ui-component${config.className ?? ''}`" :config="config"
  />
</template>
