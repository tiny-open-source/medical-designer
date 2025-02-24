<script setup lang="ts">
import serialize from 'serialize-javascript';
import { computed, ref, watchEffect } from 'vue';

interface CodeLinkConfig {
  type: 'code-link';
  name: string;
  text?: string;
  formTitle?: string;
}
defineOptions({
  name: 'l-fields-code-link',
});
const props = withDefaults(defineProps<{
  config: CodeLinkConfig;
  model: Record<string, any>;
  name: string;
  prop: string;
}>(), {
  model: () => ({}),
  name: '',
  prop: '',
});
const emit = defineEmits(['change']);
// const emit = defineEmits(['change']);
const formConfig = computed(() => ({
  ...props.config,
  text: '',
  type: 'link',
  form: [
    {
      name: props.name,
      type: 'vs-code',
    },
  ],
}));
const dslModelValue = ref<{ form: Record<string, any> }>({
  form: {},
});

watchEffect(() => {
  if (!props.model || !props.name)
    return;

  dslModelValue.value.form[props.name] = serialize(props.model[props.name], {
    space: 2,
    unsafe: true,
  }).replace(/"(\w+)":\s/g, '$1: ');
});
function changeHandler(v: Record<string, any>) {
  if (!props.name || !props.model)
    return;

  try {
    // eslint-disable-next-line vue/no-mutating-props, no-eval
    props.model[props.name] = eval(`${v[props.name]}`);
    emit('change', props.model[props.name]);
  }
  catch (e) {
    console.error(e);
  }
}
</script>

<template>
  <l-fields-link :config="formConfig" :model="dslModelValue" name="form" label-width="0" @change="changeHandler" />
</template>
