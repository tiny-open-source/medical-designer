<script lang="ts">
import type { Component, PropType } from 'vue';
import { NIcon } from 'naive-ui';
import { defineComponent, toRaw } from 'vue';

export default defineComponent({
  name: 'm-icon',

  components: { NIcon },

  props: {
    icon: {
      type: [String, Object] as PropType<string | Component>,
    },
  },

  setup() {
    return {
      toRaw,
    };
  },
});
</script>

<template>
  <NIcon v-if="!icon">
    todo
  </NIcon>
  <NIcon v-else-if="typeof icon === 'string' && icon.startsWith('http')">
    <img :src="icon">
  </NIcon>
  <i v-else-if="typeof icon === 'string'" :class="icon" />
  <NIcon v-else size="16">
    <component :is="icon" />
  </NIcon>
</template>
