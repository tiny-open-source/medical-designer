<script setup lang="ts">
import type Core from '@lowcode/core';
import type { MNode } from '@lowcode/schema';
import { ref } from 'vue';
import LowCodeRuntimeUiComponent from '../../Component.vue';
import { useApp } from '../../use-app';

const props = withDefaults(defineProps<{
  config?: Record<string, any>;
  model?: Record<string, any>;
}>(), {
  config: () => ({}),
  model: () => ({}),
});

const app: Core | undefined = useApp(props);
const node = app?.page?.getNode(props.config.id);

const style = app?.transformStyle(props.config.style || {});

// const commonMethod = useCommonMethod(props);
const visible = ref(false);
function openOverlay() {
  visible.value = true;
  if (app) {
    app.emit('overlay:open', node);
  }
}

function closeOverlay() {
  visible.value = false;
  if (app) {
    app.emit('overlay:close', node);
  }
}
app?.on('editor:select', (info, path) => {
  if (path.find((node: MNode) => node.id === props.config.id)) {
    openOverlay();
  }
  else {
    closeOverlay();
  }
});
defineExpose({
  visible,
  openOverlay,
  closeOverlay,
});
</script>

<template>
  <div
    v-if="visible"
    :id="`${config.id || ''}`"
    class="lowcode-ui-overlay"
    :style="style"
  >
    <slot />
    <LowCodeRuntimeUiComponent v-for="item in config.items" :key="item.id" :config="item" />
  </div>
</template>
