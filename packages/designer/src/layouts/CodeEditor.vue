<script setup lang="ts">
import { debounce, throttle } from 'lodash-es';
import * as monaco from 'monaco-editor';
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';

import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import JsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
import serialize from 'serialize-javascript';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

defineOptions({
  name: 'low-code-editor',
});
const props = withDefaults(defineProps<{
  initValues?: string | Record<string, any>;
  modifiedValues?: string | Record<string, any>;
  type?: string;
  language?: string;
  options?: Record<string, any>;
}>(), {
  initValues: '',
  modifiedValues: '',
  type: '',
  language: 'javascript',
  options: () => ({}),
});
const emit = defineEmits(['initd', 'save']);
// @ts-ignore
globalThis.MonacoEnvironment = {
  getWorker(workerId: any, label: any) {
    switch (label) {
      case 'typescript':
      case 'javascript':
        return new JsWorker();
      case 'json':
        return new JsonWorker();
      default:
        return new EditorWorker();
    }
  },
};
function toString(v: string | any, language: string): string {
  let value = '';
  if (typeof v !== 'string') {
    value = serialize(v, {
      space: 2,
      unsafe: true,
    }).replace(/"(\w+)":\s/g, '$1: ');
  }
  else {
    value = v;
  }
  if (language === 'javascript' && value.startsWith('{') && value.endsWith('}')) {
    value = `(${value})`;
  }
  return value;
}
const loading = ref(true);

let vsEditor: monaco.editor.IStandaloneCodeEditor | null = null;
let vsDiffEditor: monaco.editor.IStandaloneDiffEditor | null = null;
const values = ref('');
const codeEditor = ref<HTMLDivElement>();
const resizeObserver = new globalThis.ResizeObserver(
  throttle((): void => {
    vsEditor?.layout();
    vsDiffEditor?.layout();
  }, 300),
);

// 存储模型引用
let originalModel: monaco.editor.ITextModel | null = null;
let modifiedModel: monaco.editor.ITextModel | null = null;

// 优化后的setEditorValue函数
function setEditorValue(v: string | any, m: string | any) {
  const newOriginalValue = toString(v, props.language);
  const newModifiedValue = toString(m, props.language);

  if (props.type === 'diff') {
    if (!vsDiffEditor)
      return;
    if (!originalModel || !modifiedModel) {
      // 首次创建模型
      originalModel = monaco.editor.createModel(newOriginalValue, 'text/javascript');
      modifiedModel = monaco.editor.createModel(newModifiedValue, 'text/javascript');
      vsDiffEditor?.setModel({
        original: originalModel,
        modified: modifiedModel,
      });
    }
    else {
      // 更新现有模型内容
      originalModel.setValue(newOriginalValue);
      modifiedModel.setValue(newModifiedValue);
    }
    return;
  }

  // 非diff模式的处理
  values.value = newOriginalValue;
  vsEditor?.setValue(values.value);
}

// 添加防抖的更新函数
const throttledUpdate = throttle((newValue: any) => {
  if (props.type === 'diff' && modifiedModel) {
    modifiedModel.setValue(toString(newValue, props.language));
  }
}, 300);

// 监听modifiedValues的变化
watch(
  () => props.modifiedValues,
  (newVal) => {
    if (props.type === 'diff') {
      throttledUpdate(newVal);
    }
  },
  { deep: true },
);

function getEditorValue() {
  return props.type === 'diff' ? vsDiffEditor?.getModifiedEditor().getValue() : vsEditor?.getValue();
}

// 优化初始化函数
function init() {
  if (!codeEditor.value)
    return;

  const options = {
    value: values.value,
    language: props.language,
    theme: 'vs-dark',
    renderSideBySide: true, // 左右分屏diff
    readOnly: false,
    ...props.options,
  };
  if (props.type === 'diff') {
    vsDiffEditor = monaco.editor.createDiffEditor(codeEditor.value, options);
  }
  else {
    vsEditor = monaco.editor.create(codeEditor.value, options);
  }

  setEditorValue(props.initValues, props.modifiedValues);
  loading.value = false;

  emit('initd', vsEditor);

  codeEditor.value.addEventListener('keydown', (e) => {
    if (e.keyCode === 83 && (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)) {
      e.preventDefault();
      e.stopPropagation();
      emit('save', getEditorValue());
    }
  });

  if (props.type !== 'diff') {
    vsEditor?.onDidBlurEditorWidget(() => {
      emit('save', getEditorValue());
    });
  }

  codeEditor.value && resizeObserver.observe(codeEditor.value);
}
watch(
  () => props.initValues,
  (v, preV) => {
    if (v !== preV) {
      setEditorValue(props.initValues, props.modifiedValues);
    }
  },
  {
    deep: true,
    immediate: true,
  },
);

onMounted(init);
onBeforeUnmount(() => {
  resizeObserver.disconnect();
  throttledUpdate.cancel();
  modifiedModel = null;
  originalModel = null;
});
defineExpose({
  getEditor() {
    return vsEditor || vsDiffEditor;
  },
  focus() {
    vsEditor?.focus();
    vsDiffEditor?.focus();
  },
});
</script>

<template>
  <div ref="codeEditor" class="lc-d-code-editor" />
</template>
