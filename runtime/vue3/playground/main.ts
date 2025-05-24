import { createApp } from 'vue';

import App from './App.vue';
import '@low-code/core/resetcss.css';

Promise.all([import('../.low-code/comp-entry'), import('../.low-code/plugin-entry')]).then(([components, plugins]) => {
  const vm = createApp(App);

  Object.entries(components.default).forEach(([type, component]: [string, any]) => {
    vm.component(`low-code-runtime-ui-${type}`, component);
  });

  Object.values(plugins.default).forEach((plugin: any) => {
    vm.use(plugin);
  });

  vm.mount('#app');
});
