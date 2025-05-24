<script setup lang="ts">
import type { MPage } from '@low-code/schema';
import { computed } from 'vue';
import LowCodeRuntimeUiComponent from '../../Component.vue';
import { useApp } from '../../use-app';

const props = defineProps<{
  config: MPage;
}>();

const app = useApp(props);

const style = computed(() => app?.transformStyle(props.config.style || {}));
</script>

<template>
  <div
    :id="`${config.id || ''}`"
    :class="`low-code-ui-page low-code-ui-container low-code-layout-${config.layout}${
      config.className ? ` ${config.className}` : ''
    }`"
    :style="style"
  >
    <slot />
    <LowCodeRuntimeUiComponent v-for="item in config.items" :key="item.id" :config="item" />
  </div>
</template>
