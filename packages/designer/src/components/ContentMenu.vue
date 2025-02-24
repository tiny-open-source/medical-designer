<script setup lang="ts">
import type { MenuButton, MenuComponent } from '../type';
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import ToolButton from './ToolButton.vue';

const props = withDefaults(defineProps<{
  menuData?: (MenuButton | MenuComponent)[];
  isSubMenu?: boolean;
}>(), {
  isSubMenu: false,
  menuData: () => [],
});

const emit = defineEmits(['hide', 'show']);
const menu = ref<HTMLDivElement>();
const visible = ref(false);
const subMenu = ref<any>();
const subMenuData = ref<any[]>([]);

const menuStyle = ref({
  left: '0',
  top: '0',
});
function hide() {
  if (!visible.value)
    return;

  visible.value = false;
  subMenu.value?.hide();

  emit('hide');
}

function showSubMenu(item: MenuButton | MenuComponent) {
  const menuItem = item as MenuButton;
  if (typeof item !== 'object' || !menuItem.items?.length) {
    return;
  }

  subMenuData.value = menuItem.items;
  if (menu.value) {
    subMenu.value.show({
      clientX: menu.value.offsetLeft + menu.value.clientWidth,
      clientY: menu.value.offsetTop,
    });
  }
}

function hideHandler(e: MouseEvent) {
  const target = e.target as HTMLElement | undefined;
  if (!visible.value || !target) {
    return;
  }

  if (menu.value?.contains(target) || subMenu.value?.$el?.contains(target)) {
    return;
  }
  hide();
}
onMounted(() => {
  if (props.isSubMenu)
    return;

  globalThis.addEventListener('mousedown', hideHandler, true);
});

onBeforeUnmount(() => {
  if (props.isSubMenu)
    return;

  globalThis.removeEventListener('mousedown', hideHandler, true);
});
defineExpose({
  hide,
  show(e: MouseEvent) {
    // 加 setTimeout 是因为，如果菜单中的按钮监听的是mouseup，那么菜单显示出来时鼠标如果正好在菜单上就会马上触发按钮的mouseup
    setTimeout(() => {
      visible.value = true;

      nextTick(() => {
        const menuHeight = menu.value?.clientHeight || 0;

        let top = e.clientY;
        if (menuHeight + e.clientY > document.body.clientHeight) {
          top = document.body.clientHeight - menuHeight;
        }

        menuStyle.value = {
          top: `${top}px`,
          left: `${e.clientX}px`,
        };
        emit('show');
      });
    }, 300);
  },
});
</script>

<template>
  <div v-if="menuData.length && visible" ref="menu" class="lc-d-content-menu" :style="menuStyle">
    <div>
      <ToolButton
        v-for="(item, index) in menuData"
        :key="index"
        event-type="mouseup"
        :data="item"
        @mouseup="hide"
        @mouseenter="showSubMenu(item)"
      />
    </div>
    <teleport to="body">
      <content-menu
        ref="subMenu"
        class="sub-menu"
        :menu-data="subMenuData"
        :is-sub-menu="true"
        @hide="hide"
      />
    </teleport>
  </div>
</template>
