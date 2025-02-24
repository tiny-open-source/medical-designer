import type { ComponentInternalInstance } from 'vue';
import type { FormState } from '../schema';

import { getCurrentInstance, inject, watch } from 'vue';

export function useAddField(prop?: string) {
  if (!prop)
    return;
  const lForm = inject<FormState | null>('lForm');
  const instance = getCurrentInstance() as ComponentInternalInstance;
  watch(
    () => instance?.proxy,
    (vm) => {
      if (vm) {
        lForm?.setField(prop, vm);
      }
      else {
        lForm?.deleteField(prop);
      }
    },
    {
      immediate: true,
    },
  );
}
