import type { Id, MContainer, MNode } from '@low-code/schema';
import type { AddMNode, PastePosition } from '../../../designer/src/type';
import { designerService } from '@low-code/designer';

/**
 * MCP 工具参数接口定义
 */
export interface MCPAddComponentParams {
  type: string;
  name?: string;
  style?: Record<string, any>;
  parentId?: Id;
  position?: { x: number; y: number };
  properties?: Record<string, any>;
}

export interface MCPUpdateComponentParams {
  id: Id;
  style?: Record<string, any>;
  properties?: Record<string, any>;
  name?: string;
}

export interface MCPSelectComponentParams {
  id?: Id;
  selector?: {
    type?: string;
    name?: string;
    index?: number;
  };
}

export interface MCPMoveComponentParams {
  id: Id;
  position?: { x: number; y: number };
  deltaX?: number;
  deltaY?: number;
}

export interface MCPComponentInfo {
  id: Id;
  type: string;
  name?: string;
  style?: Record<string, any>;
  position?: { x: number; y: number };
  size?: { width: number; height: number };
  parentId?: Id;
  children?: MCPComponentInfo[];
}

export interface MCPCanvasState {
  selectedComponent?: MCPComponentInfo;
  selectedComponents?: MCPComponentInfo[];
  totalComponents: number;
  currentPage?: {
    id: Id;
    name?: string;
    totalPages: number;
  };
  canUndo: boolean;
  canRedo: boolean;
}

/**
 * MCP Canvas Tools Service
 * 为大模型提供画布操作工具的服务类
 */
class MCPCanvasToolsService {
  private validateId(id: Id): void {
    if (!id) {
      throw new Error('组件ID不能为空');
    }
  }

  private validateComponentType(type: string): void {
    if (!type || type.trim() === '') {
      throw new Error('组件类型不能为空');
    }
  }

  private convertNodeToInfo(node: MNode, includeChildren = false): MCPComponentInfo {
    const info: MCPComponentInfo = {
      id: node.id,
      type: node.type || 'unknown',
      name: node.name,
      style: node.style,
    };

    if (node.style) {
      if (typeof node.style.left === 'number' && typeof node.style.top === 'number') {
        info.position = { x: node.style.left, y: node.style.top };
      }
      if (typeof node.style.width === 'number' && typeof node.style.height === 'number') {
        info.size = { width: node.style.width, height: node.style.height };
      }
    }

    const parent = designerService.getParentById(node.id);
    if (parent) {
      info.parentId = parent.id;
    }

    if (includeChildren && 'items' in node && Array.isArray(node.items)) {
      info.children = node.items.map(child => this.convertNodeToInfo(child, false));
    }

    return info;
  }

  /**
   * 添加组件到画布
   */
  public async addComponent(params: MCPAddComponentParams): Promise<MCPComponentInfo> {
    this.validateComponentType(params.type);

    const addConfig: AddMNode = {
      type: params.type,
      name: params.name,
      style: {
        ...params.style,
      },
      ...params.properties,
    };

    // 设置位置
    if (params.position) {
      addConfig.style = {
        ...addConfig.style,
        left: params.position.x,
        top: params.position.y,
      };
    }

    let parent: MContainer | null = null;
    if (params.parentId) {
      const parentNode = designerService.getNodeById(params.parentId, false);
      if (!parentNode) {
        throw new Error(`找不到父容器: ${params.parentId}`);
      }
      parent = parentNode as MContainer;
    }

    const result = await designerService.add(addConfig, parent);
    const addedNode = Array.isArray(result) ? result[0] : result;

    return this.convertNodeToInfo(addedNode, true);
  }

  /**
   * 删除组件
   */
  public async removeComponent(id: Id): Promise<{ success: boolean; message: string }> {
    this.validateId(id);

    const node = designerService.getNodeById(id, false);
    if (!node) {
      throw new Error(`找不到要删除的组件: ${id}`);
    }

    await designerService.remove(node);

    return {
      success: true,
      message: `成功删除组件 ${id}`,
    };
  }

  /**
   * 更新组件属性
   */
  public async updateComponent(params: MCPUpdateComponentParams): Promise<MCPComponentInfo> {
    this.validateId(params.id);

    const existingNode = designerService.getNodeById(params.id, false);
    if (!existingNode) {
      throw new Error(`找不到要更新的组件: ${params.id}`);
    }

    const updateConfig: Partial<MNode> = {
      id: params.id,
    };

    if (params.style) {
      updateConfig.style = {
        ...existingNode.style,
        ...params.style,
      };
    }

    if (params.name !== undefined) {
      updateConfig.name = params.name;
    }

    if (params.properties) {
      Object.assign(updateConfig, params.properties);
    }

    const result = await designerService.update(updateConfig as MNode);
    const updatedNode = Array.isArray(result) ? result[0] : result;

    return this.convertNodeToInfo(updatedNode, true);
  }

  /**
   * 选中组件
   */
  public async selectComponent(params: MCPSelectComponentParams): Promise<MCPComponentInfo> {
    let targetNode: MNode | null = null;

    if (params.id) {
      this.validateId(params.id);
      targetNode = designerService.getNodeById(params.id, false);
      if (!targetNode) {
        throw new Error(`找不到组件: ${params.id}`);
      }
    }
    else if (params.selector) {
      // 根据选择器查找组件
      const root = designerService.get('root');
      if (!root) {
        throw new Error('画布为空');
      }

      const findNodeBySelector = (node: MNode, selector: any): MNode | null => {
        // 检查类型匹配
        if (selector.type && node.type !== selector.type) {
          return null;
        }

        // 检查名称匹配
        if (selector.name && node.name !== selector.name) {
          return null;
        }

        return node;
      };

      const searchNodes = (nodes: MNode[], selector: any): MNode[] => {
        const matches: MNode[] = [];
        for (const node of nodes) {
          const match = findNodeBySelector(node, selector);
          if (match) {
            matches.push(match);
          }
          if ('items' in node && Array.isArray(node.items)) {
            matches.push(...searchNodes(node.items, selector));
          }
        }
        return matches;
      };

      const matches = searchNodes(root.items || [], params.selector);
      if (matches.length === 0) {
        throw new Error('没有找到匹配的组件');
      }

      const index = params.selector.index || 0;
      if (index >= matches.length) {
        throw new Error(`索引超出范围: ${index}, 最大索引: ${matches.length - 1}`);
      }

      targetNode = matches[index];
    }
    else {
      throw new Error('必须提供 id 或 selector 参数');
    }

    const selectedNode = await designerService.select(targetNode);
    return this.convertNodeToInfo(selectedNode, true);
  }

  /**
   * 移动组件
   */
  public async moveComponent(params: MCPMoveComponentParams): Promise<MCPComponentInfo> {
    this.validateId(params.id);

    const node = designerService.getNodeById(params.id, false);
    if (!node) {
      throw new Error(`找不到要移动的组件: ${params.id}`);
    }

    // 先选中组件
    await designerService.select(node);

    if (params.position) {
      // 绝对位置移动
      const updateConfig: Partial<MNode> = {
        id: params.id,
        style: {
          ...node.style,
          left: params.position.x,
          top: params.position.y,
        },
      };
      const result = await designerService.update(updateConfig as MNode);
      const updatedNode = Array.isArray(result) ? result[0] : result;
      return this.convertNodeToInfo(updatedNode, true);
    }
    else if (params.deltaX !== undefined || params.deltaY !== undefined) {
      // 相对位置移动
      const deltaX = params.deltaX || 0;
      const deltaY = params.deltaY || 0;
      await designerService.move(deltaX, deltaY);

      const updatedNode = designerService.get('node');
      if (!updatedNode) {
        throw new Error('移动后获取组件失败');
      }
      return this.convertNodeToInfo(updatedNode, true);
    }
    else {
      throw new Error('必须提供 position 或 deltaX/deltaY 参数');
    }
  }

  /**
   * 复制组件
   */
  public async copyComponent(id: Id): Promise<{ success: boolean; message: string }> {
    this.validateId(id);

    const node = designerService.getNodeById(id, false);
    if (!node) {
      throw new Error(`找不到要复制的组件: ${id}`);
    }

    await designerService.copy(node);

    return {
      success: true,
      message: `成功复制组件 ${id}`,
    };
  }

  /**
   * 粘贴组件
   */
  public async pasteComponent(position?: { x: number; y: number }): Promise<MCPComponentInfo | MCPComponentInfo[]> {
    const pastePosition: PastePosition = {};
    if (position) {
      pastePosition.left = position.x;
      pastePosition.top = position.y;
    }

    const result = await designerService.paste(pastePosition);
    if (!result) {
      throw new Error('没有可粘贴的组件');
    }

    if (Array.isArray(result)) {
      return result.map(node => this.convertNodeToInfo(node, true));
    }
    else {
      return this.convertNodeToInfo(result, true);
    }
  }

  /**
   * 居中对齐组件
   */
  public async alignCenter(id: Id): Promise<MCPComponentInfo> {
    this.validateId(id);

    const node = designerService.getNodeById(id, false);
    if (!node) {
      throw new Error(`找不到要对齐的组件: ${id}`);
    }

    const result = await designerService.alignCenter(node);
    const alignedNode = Array.isArray(result) ? result[0] : result;

    return this.convertNodeToInfo(alignedNode, true);
  }

  /**
   * 获取组件信息
   */
  public getComponentInfo(id: Id): MCPComponentInfo {
    this.validateId(id);

    const node = designerService.getNodeById(id, false);
    if (!node) {
      throw new Error(`找不到组件: ${id}`);
    }

    return this.convertNodeToInfo(node, true);
  }

  /**
   * 获取当前画布状态
   */
  public getCanvasState(): MCPCanvasState {
    const selectedNode = designerService.get('node');
    const selectedNodes = designerService.get('nodes');
    const currentPage = designerService.get('page');
    const root = designerService.get('root');

    const state: MCPCanvasState = {
      totalComponents: 0,
      canUndo: false,
      canRedo: false,
    };

    if (selectedNode) {
      state.selectedComponent = this.convertNodeToInfo(selectedNode, true);
    }

    if (selectedNodes && selectedNodes.length > 1) {
      state.selectedComponents = selectedNodes.map(node => this.convertNodeToInfo(node, false));
    }

    if (currentPage) {
      state.currentPage = {
        id: currentPage.id,
        name: currentPage.name,
        totalPages: designerService.get('pageLength') || 0,
      };
    }

    // 计算总组件数
    if (root) {
      const countComponents = (node: MNode): number => {
        let count = 1;
        if ('items' in node && Array.isArray(node.items)) {
          count += node.items.reduce((sum, child) => sum + countComponents(child), 0);
        }
        return count;
      };
      state.totalComponents = countComponents(root) - 1; // 减去root节点
    }

    return state;
  }

  /**
   * 撤销操作
   */
  public async undo(): Promise<{ success: boolean; message: string }> {
    const result = await designerService.undo();

    return {
      success: result !== null,
      message: result ? '撤销成功' : '没有可撤销的操作',
    };
  }

  /**
   * 重做操作
   */
  public async redo(): Promise<{ success: boolean; message: string }> {
    const result = await designerService.redo();

    return {
      success: result !== null,
      message: result ? '重做成功' : '没有可重做的操作',
    };
  }

  /**
   * 获取页面结构
   */
  public getPageStructure(): MCPComponentInfo[] {
    const root = designerService.get('root');
    if (!root) {
      return [];
    }

    const buildStructure = (node: MNode): MCPComponentInfo => {
      const info = this.convertNodeToInfo(node, false);

      if ('items' in node && Array.isArray(node.items)) {
        info.children = node.items.map(child => buildStructure(child));
      }

      return info;
    };

    return (root.items || []).map(page => buildStructure(page));
  }
}

const mcpCanvasToolsService = new MCPCanvasToolsService();
export default mcpCanvasToolsService;
