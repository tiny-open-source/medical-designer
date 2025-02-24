import Core from '@lowcode/core';
import { getUrlParam } from '@lowcode/utils';
import { createApp } from 'vue';
import components from '../.lowcode/comp-entry';
import plugins from '../.lowcode/plugin-entry';

import { getLocalConfig } from '../utils';
import App from './App.vue';

const vm = createApp(App);

Object.entries(components).forEach(([type, component]: [string, any]) => {
  vm.component(`low-code-runtime-ui-${type}`, component);
});

Object.values(plugins).forEach((plugin: any) => {
  vm.use(plugin);
});

const app = new Core({
  config: ((getUrlParam('localPreview') ? getLocalConfig() : window.lowcodeDSL) || [])[0] || {},
  curPage: getUrlParam('page'),
  platform: 'device',
});

vm.config.globalProperties.app = app;
vm.provide('app', app);

vm.mount('#app');
