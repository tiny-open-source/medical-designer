<script setup lang="ts">
import type { Services } from '../type';
import Gesto from 'gesto';
import { inject, onBeforeUnmount, onMounted, ref, toRaw } from 'vue';
import { MIN_CENTER_COLUMN_WIDTH, MIN_LEFT_COLUMN_WIDTH, MIN_RIGHT_COLUMN_WIDTH } from '../services/ui.service';

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
  })
    .on('drag', (e) => {
      if (!target.value || !services)
        return;

      const currentColumnWidth = toRaw(services.uiService.get('columnWidth'));
      let { left, right } = { ...currentColumnWidth };
      if (props.type === 'left') {
        const newLeft = left + e.deltaX;
        // 确保左侧列不小于最小宽度，并且中间列有足够空间
        const maxLeft = window.innerWidth - right - MIN_CENTER_COLUMN_WIDTH;
        left = Math.max(MIN_LEFT_COLUMN_WIDTH, Math.min(newLeft, maxLeft));
      }
      else if (props.type === 'right') {
        const newRight = right - e.deltaX;
        // 确保右侧列不小于最小宽度，并且中间列有足够空间
        const maxRight = window.innerWidth - left - MIN_CENTER_COLUMN_WIDTH;
        right = Math.max(MIN_RIGHT_COLUMN_WIDTH, Math.min(newRight, maxRight));
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
