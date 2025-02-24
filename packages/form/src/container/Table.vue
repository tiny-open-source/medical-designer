<script setup lang="ts">
import type { DataTableColumns } from 'naive-ui';
import type { ColumnConfig, FormState, TableConfig } from '../schema';
import { DeleteOutlined, ExpandAltOutlined, FullscreenOutlined } from '@vicons/antd';
import { cloneDeep } from 'lodash-es';
import { NButton, NDataTable, NIcon } from 'naive-ui';
import { computed, h, inject, ref } from 'vue';
import { LFormContainer } from '..';
import { initValue } from '../utils/form';

defineOptions({
  name: 'l-form-table',
});

const props = withDefaults(defineProps<{
  config: TableConfig;
  model: Record<string, any>;
  name: string;
  prop: string;
  sortKey?: string;
  size?: 'small' | 'medium' | 'large' ;
}>(), {
  model: () => ({}),
  sortKey: '',
  size: 'small',
});
const emit = defineEmits(['change']);
const lForm = inject<FormState | undefined>('lForm');

const modelName = computed(() => props.name || props.config.name || '');
function getProp(index: number) {
  return `${props.prop}${props.prop ? '.' : ''}${index + 1}`;
}
function makeConfig(config: ColumnConfig) {
  const newConfig = cloneDeep(config);
  delete newConfig.display;
  return newConfig;
}
const columns = computed(() => props.config.items.map(
  item =>
    ({
      title: item.label,
      key: item.name,
      align: 'center',
      width: '120',
      render(row: any, index: number) {
        return h(LFormContainer, {
          labelWidth: '0',
          prop: getProp(index),
          config: makeConfig(item),
          model: row,
          size: props.size,
          onChange: (value: any) => {
            console.log('change', value);
            emit('change', props.model[modelName.value]);
          },
        });
      },
    }),
));
const mergedColumns = computed(() => {
  const _columns = cloneDeep(columns.value);
  const commonColumns: DataTableColumns = [
    {
      title: '操作',
      key: 'action',
      align: 'center',
      width: 50,
      fixed: 'left',
      render(_, index) {
        return h(
          NButton,
          {
            size: props.size,
            type: 'error',
            quaternary: true,
            onClick: () => {
              // eslint-disable-next-line vue/no-mutating-props
              props.model[modelName.value].splice(index, 1);
              emit('change', props.model[modelName.value]);
            },
          },
          { icon: () => {
            return h(NIcon, { }, { default: () => h(DeleteOutlined) });
          } },
        );
      },
    },
    {
      title: '序号',
      key: 'tags',
      align: 'center',
      width: 50,
      fixed: 'left',
      render: (_, index) => {
        return `${index + 1}`;
      },
    },
  ];
  return [...commonColumns, ..._columns] as DataTableColumns;
});
async function newHandler(row?: any) {
  if (props.config.max && props.model[modelName.value].length >= props.config.max) {
    console.error(`最多新增配置不能超过${props.config.max}条`);
    return;
  }

  const columns = props.config.items;
  const enumValues = props.config.enum || [];
  let enumV = [];
  const { length } = props.model[modelName.value];
  const key = props.config.key || 'id';
  let inputs: any = {};

  if (enumValues.length) {
    if (length >= enumValues.length) {
      return;
    }
    enumV = enumValues.filter((item) => {
      let i = 0;
      for (; i < length; i++) {
        if (item[key] === props.model[modelName.value][i][key]) {
          break;
        }
      }
      return i === length;
    });

    if (enumV.length > 0) {
      inputs = enumV[0];
    }
  }
  else if (Array.isArray(row)) {
    columns.forEach((column, index) => {
      column.name && (inputs[column.name] = row[index]);
    });
  }
  else {
    if (typeof props.config.defaultAdd === 'function') {
      inputs = await props.config.defaultAdd(lForm, {
        model: props.model[modelName.value],
        formValue: lForm?.values,
      });
    }
    else if (props.config.defaultAdd) {
      inputs = props.config.defaultAdd;
    }
    inputs = await initValue(lForm, {
      config: columns,
      initValues: inputs,
    });
  }

  if (props.sortKey && length) {
    inputs[props.sortKey] = props.model[modelName.value][length - 1][props.sortKey] - 1;
  }
  inputs.key = Date.now();

  // eslint-disable-next-line vue/no-mutating-props
  props.model[modelName.value].push(inputs);

  emit('change', props.model[modelName.value]);
}
const lTable = ref<HTMLElement | null>(null);
</script>

<template>
  <div ref="lTable" class="l-fields-table" :class="{ 'm-fields-table-item-extra': config.itemExtra }">
    <span v-if="config.extra" style="color: rgba(0, 0, 0, 0.45)" v-html="config.extra" />
    <div class="l-fields-table-content">
      <NDataTable
        v-if="model[modelName]"
        :bordered="config.border"
        :max-height="config.maxHeight"
        :single-line="false"
        :columns="mergedColumns"
        :data="model[modelName]"
        :size="size"
      />
      <slot />
      <NButton type="primary" :size="size" @click="newHandler()">
        添加
      </NButton> &nbsp;
      <NButton type="primary" :size="size">
        <template #icon>
          <NIcon>
            <ExpandAltOutlined />
          </NIcon>
        </template>
        展开配置
      </NButton> &nbsp;
      <NButton type="primary" :size="size">
        <template #icon>
          <NIcon>
            <FullscreenOutlined />
          </NIcon>
        </template>
        全屏编辑
      </NButton>
    </div>
  </div>
</template>
