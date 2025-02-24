<script setup lang="ts">
import type { GetColumnWidth, Services } from '../type';
import Gesto from 'gesto';
import { inject, onBeforeUnmount, onMounted, ref, toRaw } from 'vue';

defineOptions({
  name: 'Resizer',
});
const props = defineProps<{
  type: 'left' | 'right';
}>();
const services = inject<Services>('services');
const target = ref<HTMLElement | null>(null);

let getso: Gesto;

onMounted(() => {
  if (!target.value)
    return;

  getso = new Gesto(target.value, {
    container: window,
    pinchOutside: true,
    keepDragging: true,
  }).on('drag', (e) => {
    if (!target.value || !services)
      return;
    let { left, right } = {
      ...toRaw(services.uiService.get('columnWidth')),
    };

    if (props.type === 'left') {
      left += e.deltaX;
    }
    else if (props.type === 'right') {
      right -= e.deltaX;
    }

    services.uiService.set('columnWidth', {
      left,
      right,
    });
  });
});
onBeforeUnmount(() => {
  getso?.unset();
});
</script>

<template>
  <div ref="target" class="lc-d-resizer">
    <slot />
  </div>
</template>
