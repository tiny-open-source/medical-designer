<script setup lang="ts">
import type { MComponentInstance, MText, MTextInstance } from '../../type';
import { computed, getCurrentInstance, inject } from 'vue';
import { useApp } from '../../use-app';

const props = withDefaults(defineProps<{
  config: MText;
  model?: any;
  vars?: any;
}>(), {
  model: {},
  vars: {},
});

const app = useApp(props);
const vm: MTextInstance = getCurrentInstance()?.proxy as MTextInstance;
const hoc: MComponentInstance = inject('hoc');
const text = computed(() => {
  let text = props.config?.text || '';
  const { vars } = props;
  if (hoc?.disabled && props.config?.disabledText) {
    text = props.config.disabledText;
  }
  if (typeof text === 'function') {
    return text.bind(vm)(vm, { model: props.model });
  }
  if (Object.prototype.toString.call(vars) === '[object Object]') {
    let tmp: string = text;
    Object.entries(vars).forEach(([key, value]) => {
      tmp = tmp.replace(new RegExp(`{{${key}}}`, 'g'), value as any);
    });
    return tmp;
  }
  return text || '';
});
const style = app?.transformStyle(props.config.style || {});

const classname = computed(() => props.config?.multiple ? 'lowcode-ui-text' : 'lowcode-ui-text lowcode-ui-text--single-line');
</script>

<template>
  <div
    :id="`${props.config.id || ''}`"
    :class="classname"
    :style="style"
  >
    <slot v-if="$slots.default" />
    <span v-else>
      {{ text }}
    </span>
  </div>
</template>

<style>
.lowcode-ui-text--single-line {
  white-space: nowrap;
}
</style>
