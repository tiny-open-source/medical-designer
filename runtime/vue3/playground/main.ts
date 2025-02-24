import { createApp } from 'vue';

import App from './App.vue';

Promise.all([import('../.lowcode/comp-entry'), import('../.lowcode/plugin-entry')]).then(([components, plugins]) => {
  const vm = createApp(App);

  Object.entries(components.default).forEach(([type, component]: [string, any]) => {
    vm.component(`low-code-runtime-ui-${type}`, component);
  });

  Object.values(plugins.default).forEach((plugin: any) => {
    vm.use(plugin);
  });

  vm.mount('#app');
});
