<script setup lang="ts">
import type Core from '@low-code/core';
import { inject, reactive } from 'vue';

const app = inject<Core | undefined>('app');
const pageConfig = reactive(app?.page?.data || {});
</script>

<template>
  <low-code-runtime-ui-page :config="pageConfig" />
</template>
