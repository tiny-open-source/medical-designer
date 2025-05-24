import type Core from '@low-code/core';
import type { MApp } from '@low-code/schema';

declare global {
  interface Window {
    lowcodeDSL: MApp[];
    lowcodePresetComponents: any;
    lowcodePresetConfigs: any;
    lowcodePresetValues: any;
    lowcodePresetEvents: any;
  }
}
declare module 'vue' {
  interface ComponentCustomProperties {
    app: Core;
  }
}
