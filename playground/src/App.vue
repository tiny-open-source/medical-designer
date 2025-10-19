<script setup lang="ts">
import type { MenuBarData, MoveableOptions } from '@low-code/designer';
import type StageCore from '@low-code/stage';
import { LowCodeDesigner } from '@low-code/designer';
import { NodeType } from '@low-code/schema';
import { asyncLoadJs, figmaParser } from '@low-code/utils';
import { CodeOutlined, ImportOutlined, PlayCircleOutlined, SaveOutlined } from '@vicons/antd';
import { dateZhCN, NConfigProvider, NDialogProvider, NMessageProvider, zhCN } from 'naive-ui';
import serialize from 'serialize-javascript';
import pkg from '../../package.json';
import { ThemeColorConfig } from '../theme.config';
import DeviceGroup from './components/DeviceGroup';
import GlobalMessageSetup from './components/GlobalMessageSetup';
import ImportDSL from './components/Import';
import Preview from './components/Preview';
import componentGroupList from './configs/componentGroupList';
import { defaultDSLConfig } from './configs/dsl';

const colorRef = ref(ThemeColorConfig);
const previewVisible = ref(false);
const importDialogVisible = ref(false);
const designer = ref<InstanceType<typeof LowCodeDesigner>>();
const dsl = ref(defaultDSLConfig as any);
const defaultSelectedId = computed(() => dsl.value?.items?.[0]?.id);
const propsValues = ref<Record<string, any>>({});
const propsConfigs = ref<Record<string, any>>({});
const eventMethodList = ref<Record<string, any>>({});
const stageRectStr = ref('1024 * 600');
const stageRect = computed(() => {
  const [width, height] = stageRectStr.value.split('*').map(Number);
  return { width, height };
});
const { VITE_RUNTIME_PATH, VITE_ENTRY_PATH } = import.meta.env;
const runtimeUrl = `${VITE_RUNTIME_PATH}/playground/index.html`;
asyncLoadJs(
  `${VITE_ENTRY_PATH}/config/index.umd.js`,
).then(() => {
  propsConfigs.value = (globalThis as any).lowcodePresetConfigs;
});
asyncLoadJs(
  `${VITE_ENTRY_PATH}/value/index.umd.js`,
).then(() => {
  propsValues.value = (globalThis as any).lowcodePresetValues;
});
asyncLoadJs(
  `${VITE_ENTRY_PATH}/event/index.umd.js`,
).then(() => {
  eventMethodList.value = (globalThis as any).lowcodePresetEvents;
});
function parse(code: string) {
  try {
    const loading = (window as any).$message.loading('导入中');
    figmaParser(code).then((res) => {
      dsl.value = res.data;
      loading.destroy();
      (window as any).$message.success('导入成功');
    }).catch((e) => {
      console.error(e);
      loading.destroy();
      (window as any).$message.error(`导入失败，${e.message}`);
    });
  }
  catch (e: any) {
    (window as any).$message.error(`导入失败，${e.message}`);
  }
}

function moveableOptions(core?: StageCore): MoveableOptions {
  const options: MoveableOptions = {};
  const id = core?.dr?.target?.id;

  if (!id || !designer.value)
    return options;

  const node = designer.value.designerService.getNodeById(id);

  if (!node)
    return options;

  const isPage = node.type === NodeType.PAGE;

  options.draggable = !isPage;
  options.resizable = !isPage;
  options.rotatable = !isPage;

  // 双击后在弹层中编辑时，根组件不能拖拽
  if (core?.selectedDom?.parentElement?.classList.contains('low-code-sub-stage-wrap')) {
    options.draggable = false;
    options.resizable = false;
    options.rotatable = false;
  }

  return options;
}
window.onbeforeunload = function () {
  if (import.meta.env.MODE !== 'development') {
    return true;
  }
};

function save() {
  localStorage.setItem(
    'lowcodeDSL',
    serialize(toRaw(dsl.value), {
      space: 2,
      unsafe: true,
    }).replace(/"(\w+)":\s/g, '$1: '),
  );
  designer.value?.designerService.resetModifiedNodeId();
}
try {
  // eslint-disable-next-line no-eval
  const lowcodeDSL = eval(`(${localStorage.getItem('lowcodeDSL')})`);
  if (!lowcodeDSL) {
    save();
  }
  else {
    dsl.value = lowcodeDSL;
  }
}
catch (e) {
  console.error(e);
  save();
}
const menu: MenuBarData = {
  left: [
    {
      type: 'text',
      text: `模板编辑器 v${pkg.version}`,
    },
  ],
  center: ['delete', 'undo', 'redo', 'guides', 'rule', 'zoom'],
  right: [
    '/',
    {
      type: 'button',
      text: '导入',
      icon: ImportOutlined,
      handler: async () => {
        importDialogVisible.value = true;
      },
    },
    {
      type: 'button',
      text: '预览',
      icon: PlayCircleOutlined,
      handler: async (services) => {
        if (services?.designerService.get('modifiedNodeIds').size > 0) {
          try {
            save();
          }
          catch (e) {
            console.error(e);
          }
        }

        previewVisible.value = true;
      },
    },
    {
      type: 'button',
      text: '保存',
      icon: SaveOutlined,
      handler: () => {
        save();
        (window as any).$message.success('保存成功');
      },
    },
    '/',
    {
      type: 'button',
      icon: CodeOutlined,
      tooltip: '源码',
      handler: service => service?.uiService.set('showSrc', !service?.uiService.get('showSrc')),
    },
  ],
};
</script>

<template>
  <NConfigProvider
    abstract
    :theme-overrides="{
      common: colorRef,
    }"
    :locale="zhCN"
    :date-locale="dateZhCN"
  >
    <NMessageProvider>
      <NDialogProvider>
        <LowCodeDesigner
          ref="designer"
          v-model="dsl"
          :default-selected="defaultSelectedId"
          :moveable-options="moveableOptions"
          :props-configs="propsConfigs"
          :props-values="propsValues"
          :event-method-list="eventMethodList"
          :component-group-list="componentGroupList"
          :stage-rect="stageRect"
          :menu="menu"
          :runtime-url="runtimeUrl"
        >
          <template #workspace-content>
            <DeviceGroup v-model="stageRectStr" class="device-group" />
          </template>
        </LowCodeDesigner>
        <!-- <l-form-llm-chat
          v-model:show="aiPanelVisible" :code="dslSerialized" @update:code="(dsl: any) => llmOutputDSL = dsl" @save="() => {
            dsl = dslEvaled;
          }"
        /> -->
        <Preview v-if="designer?.designerService.get('page')" v-model:show="previewVisible" :src="`${VITE_RUNTIME_PATH}/page/index.html?localPreview=1&page=${designer?.designerService.get('page')?.id}`" />
        <ImportDSL v-model:show="importDialogVisible" @save="parse" />
        <GlobalMessageSetup />
      </NDialogProvider>
    </NMessageProvider>
  </NConfigProvider>
</template>

<style>
#app {
  width: 100%;
  height: 100%;
  display: flex;
}
.device-group {
  width: 180px;
  position: absolute;
  top: 10px;
  right: 40px;
  z-index: 10;
}
</style>
