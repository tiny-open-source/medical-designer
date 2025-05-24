import Core from '@low-code/core';
import { getUrlParam } from '@low-code/utils';
import { createApp } from 'vue';
import components from '../.low-code/comp-entry';
import plugins from '../.low-code/plugin-entry';
import { getLocalConfig } from '../utils';

import App from './App.vue';
import '@low-code/core/resetcss.css';

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
