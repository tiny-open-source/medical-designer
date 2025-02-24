<script lang="ts" setup>
import type { MenuButton, MenuComponent, Services } from '../type';
import { NButton, NDivider, NTooltip } from 'naive-ui';

import { computed, inject } from 'vue';
import MIcon from '../components/Icon.vue';

const props = withDefaults(
  defineProps<{
    data?: MenuButton | MenuComponent;
    eventType?: 'mousedown' | 'mouseup' | 'click';
  }>(),
  {
    data: () => ({
      type: 'text',
      display: false,
    }),
    eventType: 'click',
  },
);
const services = inject<Services>('services');

const disabled = computed(() => {
  if (typeof props.data === 'string')
    return false;
  if (props.data.type === 'component')
    return false;
  if (typeof props.data.disabled === 'function') {
    return props.data.disabled(services);
  }
  return props.data.disabled;
});

const display = computed(() => {
  if (!props.data)
    return false;
  if (typeof props.data === 'string')
    return true;
  if (typeof props.data.display === 'function') {
    return props.data.display(services);
  }
  return props.data.display ?? true;
});

function buttonHandler(item: MenuButton | MenuComponent, event: MouseEvent) {
  if (disabled.value)
    return;
  if (typeof (item as MenuButton).handler === 'function' && services) {
    (item as MenuButton).handler?.(services, event);
  }
}

// function dropdownHandler(command: any) {
//   if (command.item.handler) {
//     command.item.handler(services);
//   }
// }

function clickHandler(item: MenuButton | MenuComponent, event: MouseEvent) {
  if (props.eventType !== 'click')
    return;
  if (item.type === 'button') {
    buttonHandler(item, event);
  }
}

function mousedownHandler(item: MenuButton | MenuComponent, event: MouseEvent) {
  if (props.eventType !== 'mousedown')
    return;
  if (item.type === 'button') {
    buttonHandler(item, event);
  }
}

function mouseupHandler(item: MenuButton | MenuComponent, event: MouseEvent) {
  if (props.eventType !== 'mouseup')
    return;
  if (item.type === 'button') {
    buttonHandler(item, event);
  }
}
</script>

<template>
  <div
    v-if="display"
    class="menu-item"
    :class="`${data.type} ${data.className || ''}`"
    @click="clickHandler(data, $event)"
    @mousedown="mousedownHandler(data, $event)"
    @mouseup="mouseupHandler(data, $event)"
  >
    <NDivider v-if="data.type === 'divider'" :vertical="!data.direction || data.direction === 'vertical'" />
    <div v-else-if="data.type === 'text'" class="menu-item-text">
      {{ data.text }}
    </div>

    <template v-else-if="data.type === 'button'">
      <NTooltip v-if="data.tooltip" effect="dark" placement="bottom" trigger="hover">
        <template #trigger>
          <NButton size="small" quaternary circle :disabled="disabled">
            <MIcon v-if="data.icon" :icon="data.icon" /><span>{{ data.text }}</span>
          </NButton>
        </template>
        {{ data.tooltip }}
      </NTooltip>
      <NButton v-else size="small" quaternary :disabled="disabled">
        <template v-if="data.icon" #icon>
          <MIcon :icon="data.icon" />
        </template><span>{{ data.text }}</span>
      </NButton>
    </template>

    <!-- <el-dropdown v-else-if="data.type === 'dropdown'" trigger="click" :disabled="disabled" @command="dropdownHandler">
      <span class="el-dropdown-link menubar-menu-button">
        {{ data.text }}<el-icon class="el-icon--right"><ArrowDown /></el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu v-if="data.items && data.items.length">
          <el-dropdown-item v-for="(subItem, index) in data.items" :key="index" :command="{ data, subItem }">
            {{
              subItem.text
            }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown> -->

    <component v-bind="data.props || {}" :is="data.component" v-else-if="data.type === 'component'" />
  </div>
</template>
