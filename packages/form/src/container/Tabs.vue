<script setup lang="ts">
import type { FormState, TabConfig, TabPaneConfig } from '../schema';
import { NScrollbar, NTabPane, NTabs } from 'naive-ui';
import { computed, inject, ref } from 'vue';
import { display as _display, filterFunction } from '../utils/form';

defineOptions({
  name: 'l-form-tab',
});
const props = defineProps<{
  config: TabConfig;
  model: any;
  prop: string;
  name: string;
}>();

const emit = defineEmits(['change']);

const lForm = inject<FormState | undefined>('lForm');
function getActive(lForm: FormState | undefined, props: any, activeTabName: string) {
  const { config, model, prop } = props;
  const { active } = config;

  if (typeof active === 'function')
    return active(lForm, { model, formValue: lForm?.values, prop });
  if (+activeTabName >= props.config.items.length)
    return '0';
  if (typeof active !== 'undefined')
    return active;

  return '0';
}
function tabClickHandler(lForm: FormState | undefined, tab: any, props: any) {
  const { config, model, prop } = props;

  if (typeof config.onTabClick === 'function') {
    config.onTabClick(lForm, tab, { model, formValue: lForm?.values, prop, config });
  }

  const tabConfig = config.items.find((item: TabPaneConfig) => tab.name === item.status);
  if (tabConfig && typeof tabConfig.onTabClick === 'function') {
    tabConfig.onTabClick(lForm, tab, { model, formValue: lForm?.values, prop, config });
  }
}
const activeTabName = ref(getActive(lForm, props, ''));

const tabs = computed(() => {
  if (props.config.dynamic) {
    if (!props.config.name)
      throw new Error('dynamic tab 必须配置name');
    return props.model[props.config.name] || [];
  }
  return props.config.items;
});
function display(displayConfig: any) {
  return _display(lForm, displayConfig, props);
}
function tabItems(tab: TabPaneConfig) {
  return (props.config.dynamic ? props.config.items : tab.items);
}
function filter(config: any) {
  return filterFunction(lForm, config, props);
}
function changeHandler() {
  emit('change', props.model);
  if (typeof props.config.onChange === 'function') {
    props.config.onChange(lForm, { model: props.model, prop: props.prop, config: props.config });
  }
}
</script>

<template>
  <NTabs v-model:value="activeTabName" style="height: 100%;" type="line" animated @tab-click="(tab: any) => tabClickHandler(lForm, tab, props)">
    <template v-for="(tab, tabIndex) in tabs" :key="tabIndex">
      <NTabPane v-if="display(tab.display) && tabItems(tab).length" style="height: 100%;" :tab="filter(tab.title)" :name="filter(tab.status) || tabIndex.toString()">
        <NScrollbar style="height: 100%;">
          <l-form-container
            v-for="item in tabItems(tab)"
            :key="item[lForm?.keyProp || '__key']"
            :config="item"
            :model="
              config.dynamic
                ? (name ? model[name] : model)[tabIndex]
                : tab.name
                  ? (name ? model[name] : model)[tab.name]
                  : name
                    ? model[name]
                    : model
            "
            :prop="config.dynamic ? `${prop}${prop ? '.' : ''}${String(tabIndex)}` : prop"
            @change="changeHandler"
          />
        </NScrollbar>
      </NTabPane>
    </template>
  </NTabs>
</template>
