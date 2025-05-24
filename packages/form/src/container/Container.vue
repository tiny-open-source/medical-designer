<script setup lang="ts">
import type { ChildConfig, ContainerCommonConfig, FormState, FormValue } from '../schema';
import { NButton, NFormItem, NIcon, NTooltip } from 'naive-ui';
import { computed, inject, ref, resolveComponent } from 'vue';
import { display as displayFunction, filterFunction } from '../utils/form';

defineOptions({
  name: 'LFormContainer',
});
const props = withDefaults(defineProps<{
  config: ChildConfig;
  model: FormValue;
  size?: 'small' | 'large' | 'medium';
  prop?: string;
  labelWidth?: string;
  expandMore?: boolean;
  stepActive?: number | string;
}>(), {
  prop: '',
});
const emit = defineEmits(['change']);
const lForm = inject<FormState | undefined>('lForm');
const expand = ref(false);
const name = computed(() => props.config.name || '');
const labelIcon = computed(() => props.config.labelIcon);
const itemProp = computed(() => {
  let n: string | number = '';
  const { names } = props.config as any;
  if (names?.[0]) {
    [n] = names;
  }
  else if (name.value) {
    n = name.value;
  }
  else {
    return props.prop;
  }
  return `${props.prop}${props.prop ? '.' : ''}${n}`;
});
const items = computed(() => (props.config as ContainerCommonConfig).items);
const itemLabelWidth = computed(() => props.config.labelWidth || props.labelWidth);
const type = computed((): string => {
  let { type } = props.config;
  if (typeof type === 'function') {
    type = type(lForm, {
      model: props.model,
    });
  }
  if (type === 'form')
    return '';
  return type?.replace(/([A-Z])/g, '-$1').toLowerCase() || (items.value ? '' : 'text');
});
const disabled = computed(() => filterFunction(lForm, props.config.disabled, props));
const tooltip = computed(() => filterFunction(lForm, props.config.tooltip, props));
const extra = computed(() => filterFunction(lForm, props.config.extra, props));
const expandHandler = () => (expand.value = !expand.value);
const tagName = computed(() => {
  const component = resolveComponent(`l-${items.value ? 'form' : 'fields'}-${type.value}`);
  if (typeof component !== 'string')
    return component;
  return 'l-fields-text';
});
const display = computed((): boolean => {
  if (props.config.display === 'expand') {
    return expand.value;
  }

  return displayFunction(lForm, props.config.display, props);
});
const key = (config: any) => config[lForm?.keyProps];
function filterHandler(filter: any, value: FormValue | number | string) {
  if (typeof filter === 'function') {
    return filter(lForm, value, {
      model: props.model,
      values: lForm?.initValues,
      formValue: lForm?.values,
      prop: itemProp.value,
      config: props.config,
    });
  }

  if (filter === 'number') {
    return +value;
  }

  return value;
}

function changeHandler(onChange: any, value: FormValue | number | string) {
  if (typeof onChange === 'function') {
    return onChange(lForm, value, {
      model: props.model,
      values: lForm?.initValues,
      formValue: lForm?.values,
      prop: itemProp.value,
      config: props.config,
    });
  }
}

function trimHandler(trim: any, value: FormValue | number | string) {
  if (typeof value === 'string' && trim) {
    return value.replace(/^\s*/, '').replace(/\s*$/, '');
  }
}

async function onChangeHandler(v: FormValue, key?: string) {
  const { filter, onChange, trim, name, dynamicKey } = props.config as any;
  let value: FormValue | number | string = v;

  try {
    value = filterHandler(filter, v);
    value = (await changeHandler(onChange, value)) ?? value;
    value = trimHandler(trim, value) ?? value;
  }
  catch (e) {
    console.error(e);
  }
  // 动态表单类型，根据value和key参数，直接修改model
  if (dynamicKey) {
    if (key !== undefined) {
    // eslint-disable-next-line vue/no-mutating-props
      props.model[key] = value;
    }
  }
  else if (key !== undefined) {
    // eslint-disable-next-line vue/no-mutating-props
    props.model[name][key] = v;
  }
  else
  // field内容下包含field-link时，model===value, 这里避免循环引用
    if ((name || name === 0) && props.model !== value && (v !== value || props.model[name] !== value)) {
    // eslint-disable-next-line vue/no-mutating-props
      props.model[name] = value;
    }

  emit('change', props.model);
}
</script>

<template>
  <div
    v-if="config"
    :style="config.tip ? 'display: flex;align-items: baseline;' : ''"
    :class="config.className"
    class="lc-f-container"
  >
    <l-fields-hidden
      v-if="type === 'hidden'"
      :model="model"
      :config="config"
      :name="config.name"
      :disabled="disabled"
      :prop="itemProp"
    />
    <component
      :is="tagName"
      v-else-if="items && !config.text && type && display"
      :key="key(config)"
      :size="size"
      :model="model"
      :config="config"
      :name="name"
      :prop="itemProp"
      :step-active="stepActive"
      :expand-more="expand"
      :label-width="itemLabelWidth"
      @change="onChangeHandler"
    />
    <template v-else-if="type && display">
      <NFormItem
        :style="config.tip ? 'flex: 1' : ''"
        :name="itemProp"
        :label-width="itemLabelWidth"
        :colon="false"
      >
        <template #label>
          <NIcon v-if="labelIcon" size="24">
            <component :is="labelIcon" />
          </NIcon>
          <span v-else v-show="!(itemLabelWidth === '0' || !config.text)" class="label-wrapper">
            <span v-html="type === 'checkbox' ? '' : config.text" />
          </span>
        </template>
        <NTooltip v-if="tooltip">
          <component
            :is="tagName"
            :key="key(config)"
            :size="size"
            :model="model"
            :config="config"
            :name="name"
            :disabled="disabled"
            :prop="itemProp"
            @change="onChangeHandler"
          />
          <template #trigger>
            <div v-html="tooltip" />
          </template>
        </NTooltip>

        <component
          :is="tagName"
          v-else
          :key="key(config)"
          :size="size"
          :model="model"
          :config="config"
          :name="name"
          :disabled="disabled"
          :prop="itemProp"
          @change="onChangeHandler"
        />

        <div v-if="extra" class="l-form-tip" v-html="extra" />
      </NFormItem>

      <NTooltip v-if="config.tip" placement="left">
        <template #trigger>
          <div v-html="config.tip" />
        </template>
      </NTooltip>
    </template>
    <template v-else-if="items && display">
      <template v-if="name || name === 0 ? model[name] : model">
        <l-form-container
          v-for="item in items"
          :key="key(item)"
          :model="name || name === 0 ? model[name] : model"
          :config="item"
          :size="size"
          :step-active="stepActive"
          :expand-more="expand"
          :label-width="itemLabelWidth"
          :prop="itemProp"
          @change="onChangeHandler"
        />
      </template>
    </template>

    <div v-if="config.expand && type !== 'fieldset'" style="text-align: center">
      <NButton text @click="expandHandler">
        {{ expand ? '收起配置' : '展开更多配置' }}
      </NButton>
    </div>
  </div>
</template>

<style scoped>
.lc-f-container ::v-deep(.n-form-item-blank){
  flex-wrap: wrap !important;
  height: 100%;
}
.label-wrapper {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.label-icon {
  font-size: 12px;
}
</style>
