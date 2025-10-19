/**
 * 工具调用显示配置
 * 提供工具名称到用户友好显示名称的映射
 */

export const TOOL_DISPLAY_CONFIG = {
  // 组件操作工具
  addComponent: {
    name: '添加组件',
    description: '正在向画布添加新组件...',
    icon: '➕',
  },
  removeComponent: {
    name: '删除组件',
    description: '正在从画布删除组件...',
    icon: '🗑️',
  },
  updateComponent: {
    name: '更新组件',
    description: '正在更新组件属性...',
    icon: '✏️',
  },
  selectComponent: {
    name: '选择组件',
    description: '正在选择画布组件...',
    icon: '👆',
  },
  moveComponent: {
    name: '移动组件',
    description: '正在移动组件位置...',
    icon: '📐',
  },
  copyComponent: {
    name: '复制组件',
    description: '正在复制组件...',
    icon: '📋',
  },
  pasteComponent: {
    name: '粘贴组件',
    description: '正在粘贴组件到画布...',
    icon: '📌',
  },
  alignCenter: {
    name: '居中对齐',
    description: '正在对齐组件...',
    icon: '🎯',
  },

  // 查询工具
  getComponentInfo: {
    name: '获取组件信息',
    description: '正在查询组件详细信息...',
    icon: '🔍',
  },
  getCanvasState: {
    name: '获取画布状态',
    description: '正在获取画布当前状态...',
    icon: '📊',
  },
  getPageStructure: {
    name: '获取页面结构',
    description: '正在分析页面结构...',
    icon: '🏗️',
  },

  // 历史操作工具
  undo: {
    name: '撤销操作',
    description: '正在撤销上一步操作...',
    icon: '↶',
  },
  redo: {
    name: '重做操作',
    description: '正在重做操作...',
    icon: '↷',
  },
} as const;

/**
 * 获取工具的显示配置
 * @param toolName 工具名称
 * @returns 工具显示配置
 */
export function getToolDisplayConfig(toolName: string) {
  return TOOL_DISPLAY_CONFIG[toolName as keyof typeof TOOL_DISPLAY_CONFIG] || {
    name: toolName,
    description: `正在执行 ${toolName}...`,
    icon: '🔧',
  };
}

/**
 * 获取工具调用状态的显示文本
 * @param status 工具调用状态
 * @param toolCount 工具数量
 * @returns 状态显示文本
 */
export function getToolCallStatusText(
  status: 'executing' | 'completed' | 'failed',
  toolCount: number = 1,
) {
  switch (status) {
    case 'executing':
      return toolCount === 1 ? '正在执行工具调用' : `正在执行 ${toolCount} 个工具调用`;
    case 'completed':
      return toolCount === 1 ? '工具调用完成' : `${toolCount} 个工具调用已完成`;
    case 'failed':
      return toolCount === 1 ? '工具调用失败' : `${toolCount} 个工具调用失败`;
    default:
      return '工具调用中';
  }
}
