<script setup lang="ts">
import type { Services, StageOptions } from '@designer/type';

import { computed, inject, onBeforeUnmount, useTemplateRef, watch } from 'vue';

const { stageOverlayService, designerService } = inject<Services>('services')!;

const stageOptions = inject<StageOptions>('stageOptions')!;

const stageOverlayEl = useTemplateRef<HTMLDivElement>('stageOverlay');

const stageOverlayVisible = computed(() =>
  stageOverlayService.get('stageOverlayVisible'),
);
const wrapWidth = computed(() => stageOverlayService.get('wrapWidth'));
const wrapHeight = computed(() => stageOverlayService.get('wrapHeight'));
const stage = computed(() => designerService.get('stage'));

const style = computed(() => ({
  width: `${wrapWidth.value}px`,
  height: `${wrapHeight.value}px`,
}));

watch(stage, (stage) => {
  if (stage) {
    stage.on('dblclick', async (event: MouseEvent) => {
      const el
        = (await stage?.getElementFromPoint(event)) || null;

      stageOverlayService.openOverlay(el);
    });
  }
  else {
    stageOverlayService.closeOverlay();
  }
});

watch(stageOverlayEl, async (stageOverlay) => {
  const subStage = stageOverlayService.createStage(stageOptions);
  stageOverlayService.set('stage', subStage);
  if (stageOverlay && subStage) {
    subStage.mount(stageOverlay);

    const { mask, renderer } = subStage;

    const { contentWindow } = renderer!;
    mask?.showRule(false);

    stageOverlayService.updateOverlay();

    contentWindow?.['low-code'].onRuntimeReady({});
  }
});

onBeforeUnmount(() => {
  stageOverlayService.get('stage')?.destroy();
  stageOverlayService.set('stage', null);
});

function closeOverlayHandler() {
  stageOverlayService.closeOverlay();
}
</script>

<template>
  <div
    v-if="stageOverlayVisible"
    class="lc-d-stage-overlay"
    @click="closeOverlayHandler"
  >
    <div
      ref="stageOverlay"
      class="lc-d-stage-overlay-container"
      :style="style"
      @click.stop
    />
  </div>
</template>
