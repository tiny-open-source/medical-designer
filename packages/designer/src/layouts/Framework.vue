<script setup lang="ts">
import type { Services } from '../type';
import { computed, inject } from 'vue';
import AddPageBox from './AddPageBox.vue';
import Resizer from './Resizer.vue';

defineProps<{
  codeOptions?: Record<string, any>;
}>();
const { uiService, designerService } = inject<Services>('services')!;
const columnWidth = computed(() => uiService.get('columnWidth'));

const showSrc = computed(() => uiService?.get('showSrc'));
const root = computed(() => designerService?.get('root'));
const pageLength = computed(() => designerService?.get('pageLength') || 0);

function saveCode(value: string) {
  try {
    // eslint-disable-next-line no-eval
    designerService.set('root', eval(value));
  }
  catch (e: any) {
    console.error(e);
  }
}
</script>

<template>
  <div class="lc-d-framework">
    <div class="lc-d-framework__nav">
      <slot name="header" />
    </div>

    <low-code-editor v-if="showSrc" :code-options="codeOptions" :init-values="root" class="lc-d-framework__content" @save="saveCode" />
    <div v-else class="lc-d-framework__content">
      <div class="lc-d-framework__content__left" :style="{ width: `${columnWidth.left}px` }">
        <slot name="sidebar" />
      </div>
      <Resizer type="left" />
      <template v-if="pageLength > 0">
        <div class="lc-d-framework__content__center" :style="{ width: `${columnWidth.center}px` }">
          <slot name="workspace" />
        </div>
        <Resizer type="right" />
        <div class="lc-d-framework__content__right" :style="{ width: `${columnWidth.right}px` }">
          <slot name="props-panel" />
        </div>
      </template>
      <slot v-else name="empty">
        <AddPageBox />
      </slot>
    </div>
  </div>
</template>
