<script setup lang="ts">
import type { MNode } from '@lowcode/schema';
import type { TreeDropInfo, TreeOption, TreeOverrideNodeClickBehavior, TreeOverrideNodeClickBehaviorReturn } from 'naive-ui';
import type { AllowDrop } from 'naive-ui/es/tree/src/interface';
import type { Ref } from 'vue';
import type { DesignerService } from '../../services/designer.service';
import type { Services } from '../../type';
import { SearchOutlined } from '@vicons/antd';
import { throttle } from 'lodash-es';
import { NIcon, NInput, NScrollbar, NTree } from 'naive-ui';
import { computed, h, inject, ref, watchEffect } from 'vue';
import LayerMenu from './LayerMenu.vue';

defineOptions({
  name: 'low-code-layer-panel',
});

const throttleTime = 150;
function useFilter() {
  const filterText = ref('');
  return {
    filterText,

    filterNode: (value: string, data: any): boolean => {
      if (!value) {
        return true;
      }
      let name = '';
      if (data.name) {
        name = data.name;
      }
      else if (data.items) {
        name = 'container';
      }
      return `${data.id}${name}${data.type}`.includes(value);
    },

  };
}

function useStatus(tree: Ref<InstanceType<typeof NTree> | undefined>, designerService: Services['designerService']) {
  const highlightNode = ref<MNode | null>();
  const node = ref<MNode | null>();
  const page = computed(() => designerService?.get('page'));
  watchEffect(() => {
    if (!tree.value)
      return;
    node.value = designerService?.get('node');

    highlightNode.value = designerService?.get('highlightNode');
  });

  return {
    values: computed(() => (page.value ? [page.value] : [])),
    expandedKeys: computed(() => (page.value ? [page.value.id] : [])),
    defaultSelectedKeys: computed(() => (node.value ? [node.value.id] : [])),
    highlightNode,
    clickNode: node,

  };
}
const clicked = ref(false);
const tree = ref<InstanceType<typeof NTree>>();
const services = inject<Services>('services');
const designerService = services!.designerService;
const statusData = useStatus(tree, designerService);
const { values, highlightNode, defaultSelectedKeys } = statusData;
const canHighlight = computed(
  () => statusData.highlightNode.value?.id !== statusData.clickNode.value?.id && !clicked.value,
);

function toggleClickFlag() {
  clicked.value = !clicked.value;
}
function highlight(data: MNode, designerService?: DesignerService) {
  if (!data?.id) {
    throw new Error('没有id');
  }
  designerService?.highlight(data);
  designerService?.get('stage')?.highlight(data.id);
}
const highlightHandler = throttle((data: MNode) => {
  highlight(data, designerService);
}, throttleTime);
const { filterText, filterNode } = useFilter();
async function select(data: MNode, editorService?: DesignerService) {
  if (!data.id) {
    throw new Error('没有id');
  }

  await editorService?.select(data);
  editorService?.get('stage')?.select(data.id);
}
const override: TreeOverrideNodeClickBehavior = ({ option }): TreeOverrideNodeClickBehaviorReturn => {
  if (services?.uiService.get('uiSelectMode')) {
    document.dispatchEvent(new CustomEvent('ui-select', { detail: option }));
    return 'toggleSelect';
  }
  select(option as MNode, designerService);
  return 'toggleSelect';
};
function findSiblingsAndIndex(
  node: LTreeOption,
  nodes?: LTreeOption[],
): [LTreeOption[], number] | [null, null] {
  if (!nodes)
    return [null, null];
  for (let i = 0; i < nodes.length; ++i) {
    const siblingNode = nodes[i];
    if (siblingNode.id === node.id)
      return [nodes, i];
    const [siblings, index] = findSiblingsAndIndex(node, siblingNode.items);
    if (siblings && index !== null)
      return [siblings, index];
  }
  return [null, null];
}

interface LTreeOption extends TreeOption {
  items?: LTreeOption[];
}

interface LTreeDropInfo extends TreeDropInfo {
  node: LTreeOption;
}
function handleDrop({ node, dragNode, dropPosition }: LTreeDropInfo) {
  const data = values.value;
  const [dragNodeSiblings, dragNodeIndex] = findSiblingsAndIndex(
    dragNode,
    data,
  );
  if (dragNodeSiblings === null || dragNodeIndex === null)
    return;
  dragNodeSiblings.splice(dragNodeIndex, 1);
  if (dropPosition === 'inside') {
    if (node.items) {
      node.items.unshift(dragNode);
    }
    else {
      node.items = [dragNode];
    }
  }
  else if (dropPosition === 'before') {
    const [nodeSiblings, nodeIndex] = findSiblingsAndIndex(
      node,
      data,
    );
    if (nodeSiblings === null || nodeIndex === null)
      return;
    nodeSiblings.splice(nodeIndex, 0, dragNode);
  }
  else if (dropPosition === 'after') {
    const [nodeSiblings, nodeIndex] = findSiblingsAndIndex(
      node,
      data,
    );
    if (nodeSiblings === null || nodeIndex === null)
      return;
    nodeSiblings.splice(nodeIndex + 1, 0, dragNode);
  }
  designerService?.update(data[0]);
}
const allowDrop: AllowDrop = ({ dropPosition, node }) => {
  if (node.isLeaf === false)
    return true;
  if (node.items) {
    return true;
  }
  return dropPosition !== 'inside';
};
const menu = ref<InstanceType<typeof LayerMenu>>();
function nodeProps({ option }: { option: any }) {
  return {
    async onContextmenu(e: MouseEvent) {
      e.preventDefault();
      await select(option, designerService);
      menu.value?.show(e);
    },
  };
}
</script>

<template>
  <div class="lc-d-layer-panel">
    <slot name="layer-panel-header" />

    <div
      class="search-input"
    >
      <NInput
        v-model:value="filterText"
        placeholder="输入关键字进行过滤"
        size="tiny"
        clearable
      >
        <template #prefix>
          <NIcon :component="SearchOutlined" />
        </template>
      </NInput>
    </div>
    <NScrollbar style="height: calc(100% - 40px)">
      <NTree
        ref="tree"
        class="lc-d-layer-panel__tree"
        block-line
        block-node
        show-line
        draggable
        key-field="id"
        label-field="name"
        children-field="items"
        :node-props="nodeProps"
        :allow-drop="allowDrop"
        :watch-props="['defaultSelectedKeys']"
        :pattern="filterText"
        :filter="filterNode"
        :override-default-node-click-behavior="override"
        :default-selected-keys="defaultSelectedKeys"
        :data="values"
        :render-label="({ option }) => h('div', {
          id: option.id,
          class: {
            'cus-tree-node-hover': canHighlight && option.id === highlightNode?.id,
          },
          style: {
          },
          onMousedown: toggleClickFlag,
          onMouseup: toggleClickFlag,
          onMousemove: () => highlightHandler(option as MNode),
        }, h('span', `${option.name} (${option.id})`))"
        @drop="handleDrop"
      />
    </NScrollbar>
    <teleport to="body">
      <LayerMenu ref="menu" />
    </teleport>
  </div>
</template>
