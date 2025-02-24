<script setup lang="ts">
import type { MPage } from '@lowcode/schema';
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
    :class="`lowcode-ui-page lowcode-ui-container lowcode-layout-${config.layout}${
      config.className ? ` ${config.className}` : ''
    }`"
    :style="style"
  >
    <slot />
    <LowCodeRuntimeUiComponent v-for="item in config.items" :key="item.id" :config="item" />
  </div>
</template>
