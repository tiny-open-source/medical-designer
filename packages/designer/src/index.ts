import type { App } from 'vue';
import type { InstallOptions } from './type';
import Editor from './Designer.vue';

import Code from './fields/Code.vue';
import CodeLink from './fields/CodeLink.vue';
import StyleSetter from './fields/StyleSetter/index.vue';
import UISelect from './fields/UISelect.vue';
import CodeEditor from './layouts/CodeEditor.vue';
import './theme/index.scss';

import '@unocss/reset/tailwind-compat.css';

export { default as ContentMenu } from './components/ContentMenu.vue';
export { default as Icon } from './components/Icon.vue';

export { default as LowCodeDesigner } from './Designer.vue';

export { default as CodeEditor } from './layouts/CodeEditor.vue';
export { default as componentListService } from './services/component-list.service';
export { default as designerService } from './services/designer.service';
export { default as historyService } from './services/history.service';
export { default as storageService } from './services/storage.service';
export { default as uiService } from './services/ui.service';

export * from './type';

export type { MoveableOptions } from '@low-code/stage';
const defaultInstallOptions: InstallOptions = {
  // @todo, 自定义图片上传方法等编辑器依赖的外部选项
};
export default {
  install: (app: App, opt?: InstallOptions): void => {
    const option = Object.assign(defaultInstallOptions, opt || {});

    app.config.globalProperties.$LOWCODE_DESIGNER = option;

    app.component(Editor.name!, Editor);
    app.component(UISelect.name!, UISelect);
    app.component(CodeLink.name!, CodeLink);
    app.component(Code.name!, Code);
    app.component(CodeEditor.name!, CodeEditor);
    app.component(StyleSetter.name!, StyleSetter);
  },
};
