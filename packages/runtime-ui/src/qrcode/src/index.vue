<script setup lang="ts">
import type { MImg, MQrcode } from '../../type';
import QRCode from 'qrcode';

import { ref, watch } from 'vue';

import { useApp } from '../../use-app';

const props = withDefaults(defineProps<{
  config?: MQrcode;
  model?: Record<string, any>;
}>(), {
  config: () => ({
    src: '',
    url: '',
  }),
  model: () => ({}),
});

useApp(props);

const imgUrl = ref();
watch(
  () => props.config.url,
  (url = '') => {
    QRCode.toDataURL(url, (e: any, url: string) => {
      if (e)
        console.error(e);
      imgUrl.value = url;
    });
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <img class="magic-ui-qrcode" :src="imgUrl">
</template>
