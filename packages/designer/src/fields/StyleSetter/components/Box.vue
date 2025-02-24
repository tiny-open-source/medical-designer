<script lang="ts" setup>
import type { FormValue } from '@lowcode/form';

withDefaults(
  defineProps<{
    model: FormValue;
  }>(),
  {},
);

const emit = defineEmits(['change']);

const list = [
  {
    name: 'marginTop',
    type: 'number',
    class: 'outer-top-border',
  },
  {
    name: 'marginRight',
    type: 'number',
    class: 'outer-right-border',
  },
  {
    name: 'marginBottom',
    type: 'number',
    text: 'MARGIN',
    class: 'outer-bottom-border',
  },
  {
    type: 'number',
    name: 'marginLeft',
    class: 'outer-left-border',
  },
  {
    type: 'number',
    name: 'paddingTop',
    class: 'inner-top-border',
  },
  {
    type: 'number',
    name: 'paddingRight',
    class: 'inner-right-border',
  },
  {
    type: 'number',
    name: 'paddingBottom',
    text: 'PADDING',
    class: 'inner-bottom-border',
  },
  {
    type: 'number',
    name: 'paddingLeft',
    class: 'inner-left-border',
  },
];

function change(event: Event, name: string) {
  emit('change', (event.target as HTMLInputElement).value, name);
}
</script>

<template>
  <div class="layout-box-container">
    <div v-for="(item, index) in list" :key="index" :class="item.class">
      <span v-if="item.text" class="help-txt">{{ item.text }}</span>
      <span class="next-input">
        <input
          v-model="
            // eslint-disable-next-line vue/no-mutating-props
            model[item.name]"
          :title="model[item.name]"
          placeholder="0"
          @change="change($event, item.name)"
        >
      </span>
    </div>
  </div>
</template>
