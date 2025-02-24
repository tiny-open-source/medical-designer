import type Core from '@lowcode/core';
import type { MApp } from '@lowcode/schema';

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
