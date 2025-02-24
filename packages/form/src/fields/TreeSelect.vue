<script setup lang="ts">
import type { TreeSelectOverrideNodeClickBehavior } from 'naive-ui';
import type { PropType } from 'vue';
import type { FormState, SelectGroupOption, SelectOption, TreeSelectConfig } from '../schema';
import { NTreeSelect } from 'naive-ui';
import { computed, inject, onBeforeMount, ref, watch } from 'vue';

import fieldProps from '../utils/fieldProps';

defineOptions({
  name: 'l-fields-tree-select',
});
const props = defineProps({
  ...fieldProps,
  size: String as PropType<'small' | 'medium' | 'large'>,
  config: {
    type: Object as PropType<TreeSelectConfig>,
    required: true,
  },
});
const emit = defineEmits(['change', 'input']);
const options = ref<any[]>([]);
const lForm = inject<FormState | undefined>('lForm');
const modelName = computed(() => props.name || props.config.name || '');
const treeSelectRef = ref<InstanceType<typeof NTreeSelect> | null>(null);
if (typeof props.config.options === 'function') {
  watch(
    () => lForm?.values,
    () => {
      typeof props.config.options === 'function'
      && Promise.resolve(
        props.config.options(lForm, {
          model: props.model,
          prop: props.prop,
          formValues: lForm?.values,
          formValue: lForm?.values,
          config: props.config,
        }),
      ).then((data) => {
        options.value = data;
      });
    },
    {
      deep: true,
      immediate: true,
    },
  );
}
else if (Array.isArray(props.config.options)) {
  watch(
    () => props.config.options,
    () => {
      options.value = props.config.options as SelectOption[] | SelectGroupOption[];
    },
    { immediate: true },
  );
}
else if (props.config.option) {
  onBeforeMount(() => {
    if (!props.model)
      return;
    const v = props.model[props.name];
    if (Array.isArray(v) ? v.length : v) {
      getInitOption().then((data) => {
        options.value = data;
      });
    }
  });
}
function getInitOption() {
  return Promise.resolve([]);
}

const override: TreeSelectOverrideNodeClickBehavior = ({ option }) => {
  if (option.children) {
    return 'toggleExpand';
  }
  return 'default';
};
function findPath(options: any[], value: any): any[] {
  if (!options?.length || value === undefined) {
    return [];
  }

  function dfs(nodes: any[], target: any, currentPath: any[] = []): any[] {
    for (const node of nodes) {
      // 添加当前节点到路径
      const path = [...currentPath, node.value];

      // 找到目标值
      if (node.value === target) {
        return path;
      }

      // 递归查找子节点
      if (node.children?.length) {
        const foundPath = dfs(node.children, target, path);
        if (foundPath.length) {
          return foundPath;
        }
      }
    }
    return [];
  }

  return dfs(options, value);
}
const modelValue = computed(() => {
  const values = props.model[modelName.value];
  if (!values) {
    return;
  }
  if (typeof values === 'string') {
    return values;
  }
  return values.value;
});
function changeHandler(value: string | number | Array<string | number> | null) {
  // 在options中查找对应的option，并记录value路径，使用,分隔, 从外层往内查
  const path = findPath(options.value, value);

  emit('change', {
    value,
    path: path.join(','),
  });
}
</script>

<template>
  <NTreeSelect
    ref="treeSelectRef"
    :value="modelValue"
    block-line
    cascade
    filterable
    :options="options"
    :show-path="true"
    separator=","
    label-field="text"
    key-field="value"
    class="l-tree-select"
    placeholder="请选择"
    clearable
    :size="size"
    :override-default-node-click-behavior="override"
    @update:value="changeHandler"
  />
</template>
