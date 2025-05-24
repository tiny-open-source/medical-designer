<script setup lang="ts">
import type { Services } from '../../type';
import { isPage } from '@low-code/utils';
import KeyController from 'keycon';
import { computed, inject, onMounted, ref } from 'vue';
import LowCodeStage from './Stage.vue';

defineOptions({
  name: 'Workspace',
});
const services = inject<Services>('services');
const workspace = ref<HTMLElement | null>(null);
const nodes = computed(() => services?.designerService.get('nodes'));
let keycon: KeyController;
function mouseenterHandler() {
  workspace.value?.focus();
}

function mouseleaveHandler() {
  workspace.value?.blur();
}
onMounted(() => {
  if (!workspace.value) {
    return;
  }
  workspace.value?.addEventListener('mouseenter', mouseenterHandler);
  workspace.value?.addEventListener('mouseleave', mouseleaveHandler);

  keycon = new KeyController(workspace.value);

  const isMac = /mac os x/.test(navigator.userAgent.toLowerCase());

  const ctrl = isMac ? 'meta' : 'ctrl';

  keycon
    .keyup('delete', (e) => {
      e.inputEvent.preventDefault();
      if (!nodes.value || isPage(nodes.value[0]))
        return;
      services?.designerService.remove(nodes.value);
    })
    .keyup('backspace', (e) => {
      e.inputEvent.preventDefault();
      if (!nodes.value || isPage(nodes.value[0]))
        return;
      services?.designerService.remove(nodes.value);
    })
    .keydown([ctrl, 'c'], (e) => {
      e.inputEvent.preventDefault();
      nodes.value && services?.designerService.copy(nodes.value);
    })
    .keydown([ctrl, 'v'], (e) => {
      e.inputEvent.preventDefault();
      nodes.value && services?.designerService.paste({ offsetX: 10, offsetY: 10 });
    })
    .keydown([ctrl, 'x'], (e) => {
      e.inputEvent.preventDefault();
      if (!nodes.value || isPage(nodes.value[0]))
        return;
      services?.designerService.copy(nodes.value);
      services?.designerService.remove(nodes.value);
    })
    .keydown([ctrl, 'z'], (e) => {
      e.inputEvent.preventDefault();
      services?.designerService.undo();
    })
    .keydown([ctrl, 'shift', 'z'], (e) => {
      e.inputEvent.preventDefault();
      services?.designerService.redo();
    })
    .keydown('up', (e) => {
      e.inputEvent.preventDefault();
      services?.designerService.move(0, -1);
    })
    .keydown('down', (e) => {
      e.inputEvent.preventDefault();
      services?.designerService.move(0, 1);
    })
    .keydown('left', (e) => {
      e.inputEvent.preventDefault();
      services?.designerService.move(-1, 0);
    })
    .keydown('right', (e) => {
      e.inputEvent.preventDefault();
      services?.designerService.move(1, 0);
    })
    .keydown([ctrl, 'up'], (e) => {
      e.inputEvent.preventDefault();
      services?.designerService.move(0, -10);
    })
    .keydown([ctrl, 'down'], (e) => {
      e.inputEvent.preventDefault();
      services?.designerService.move(0, 10);
    })
    .keydown([ctrl, 'left'], (e) => {
      e.inputEvent.preventDefault();
      services?.designerService.move(-10, 0);
    })
    .keydown([ctrl, 'right'], (e) => {
      e.inputEvent.preventDefault();
      services?.designerService.move(10, 0);
    })
    .keydown('tab', (e) => {
      e.inputEvent.preventDefault();
      services?.designerService.selectNextNode();
    })
    .keydown([ctrl, 'tab'], (e) => {
      e.inputEvent.preventDefault();
      services?.designerService.selectNextPage();
    })
    .keydown([ctrl, '='], (e) => {
      e.inputEvent.preventDefault();
      services?.uiService.zoom(0.1);
    })
    .keydown([ctrl, 'numpadplus'], (e) => {
      e.inputEvent.preventDefault();
      services?.uiService.zoom(0.1);
    })
    .keydown([ctrl, '-'], (e) => {
      e.inputEvent.preventDefault();
      services?.uiService.zoom(-0.1);
    })
    .keydown([ctrl, 'numpad-'], (e) => {
      e.inputEvent.preventDefault();
      services?.uiService.zoom(-0.1);
    })
    .keydown([ctrl, '0'], (e) => {
      e.inputEvent.preventDefault();
      services?.uiService.set('zoom', services.uiService.calcZoom());
    })
    .keydown([ctrl, '1'], (e) => {
      e.inputEvent.preventDefault();
      services?.uiService.set('zoom', 1);
    });
});
const page = computed(() => services?.designerService.get('page'));
</script>

<template>
  <div ref="workspace" class="lc-d-workspace" tabindex="1">
    <slot name="stage">
      <LowCodeStage :key="page?.id" />
    </slot>
    <slot name="workspace-content" />
  </div>
</template>
