<script setup lang="ts">
import type { Services } from '../type';

import { NodeType } from '@low-code/schema';

import { PlusCircleOutlined } from '@vicons/antd';
import { NIcon } from 'naive-ui';
import { inject, toRaw } from 'vue';
import { generatePageNameByApp } from '../utils';

const services = inject<Services>('services');

function clickHandler() {
  const { designerService } = services || {};

  const root = toRaw(designerService?.get('root'));
  if (!root)
    throw new Error('root 不能为空');

  designerService?.add({
    type: NodeType.PAGE,
    name: generatePageNameByApp(toRaw(designerService.get('root')!)),
  });
}
</script>

<template>
  <div class="lc-d-framework-empty-panel">
    <div class="lc-d-framework-empty-content">
      <div class="lc-d-framework-empty-button" @click="clickHandler">
        <div>
          <NIcon>
            <PlusCircleOutlined />
          </NIcon>
        </div>
        <p>新增模板</p>
      </div>
    </div>
  </div>
</template>
