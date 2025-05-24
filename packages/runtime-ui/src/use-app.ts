import type Core from '@low-code/core';
import { getCurrentInstance, inject, onBeforeUnmount, onMounted } from 'vue';

export function useApp(props: any) {
  const app: Core | undefined = inject('app');

  const node = app?.page?.getNode(props.config.id);
  const vm = getCurrentInstance();

  node?.emit('created', vm);

  onMounted(() => {
    node?.emit('mounted', vm);
  });

  onBeforeUnmount(() => {
    node?.emit('destroy', vm);
  });

  return app;
}
