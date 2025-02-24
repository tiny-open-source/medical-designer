<script setup lang="ts">
import type { MImg } from '../../type';
import { ref } from 'vue';
import { useApp } from '../../use-app';

const props = withDefaults(defineProps<{
  config?: MImg;
  model?: Record<string, any>;
}>(), {
  config: () => ({
    src: '',
    url: '',
  }),
  model: () => ({}),
});

useApp(props);

// const commonMethod = useCommonMethod(props);
const visible = ref(false);
function clickHandler() {
  if (props.config.url)
    window.location.href = props.config.url;
}
defineExpose({
  visible,
});
</script>

<template>
  <img class="magic-ui-img" :src="config.src" @click="clickHandler">
</template>
