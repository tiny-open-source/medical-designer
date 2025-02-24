<script setup lang="ts">
import { computed } from 'vue';

defineOptions({
  name: 'l-fields-vs-code',
});
const props = defineProps<{
  config: Record<string, any>;
  name: string;
  model: Record<string, any>;
  prop: string;
}>();
const emit = defineEmits(['change']);
const language = computed(() => props.config.language || 'javascript');
const height = computed(() => `${document.body.clientHeight - 168}px`);

function save(v: string) {
  // eslint-disable-next-line vue/no-mutating-props
  props.model[props.name] = v;
  emit('change', v);
}
</script>

<template>
  <low-code-editor
    :style="`height: ${height}; width: 900px;`"
    :init-values="model[name]"
    :language="language"
    @save="save"
  />
</template>
