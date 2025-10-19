import type { Id } from '@low-code/schema';
import type { MCPToolDefinition } from './mcp-canvas-tools.config';
import type {
  MCPAddComponentParams,
  MCPCanvasState,
  MCPComponentInfo,
  MCPMoveComponentParams,
  MCPSelectComponentParams,
  MCPUpdateComponentParams,
} from './mcp-canvas-tools.service';
import { MCP_CANVAS_TOOLS } from './mcp-canvas-tools.config';
import mcpCanvasToolsService from './mcp-canvas-tools.service';

/**
 * MCP工具执行结果
 */
export interface MCPToolResult {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
}

/**
 * MCP Canvas Tools 主服务类
 * 提供简化的工具调用接口
 */
export class MCPCanvasTools {
  /**
   * 获取所有可用工具的定义
   */
  public getToolDefinitions(): { type: string; function: MCPToolDefinition }[] {
    return Object.values(MCP_CANVAS_TOOLS).map((tool) => {
      return {
        type: 'function',
        function: tool,
      };
    });
  }

  /**
   * 安全地执行工具方法
   */
  private async executeTool<T>(
    operation: () => Promise<T> | T,
  ): Promise<MCPToolResult> {
    try {
      const result = await operation();
      return {
        success: true,
        data: result,
      };
    }
    catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  // ========== 组件操作工具 ==========

  /**
   * 添加组件
   */
  public async addComponent(params: MCPAddComponentParams): Promise<MCPToolResult> {
    return this.executeTool(() => mcpCanvasToolsService.addComponent(params));
  }

  /**
   * 删除组件
   */
  public async removeComponent(params: { id: Id }): Promise<MCPToolResult> {
    return this.executeTool(() => mcpCanvasToolsService.removeComponent(params.id));
  }

  /**
   * 更新组件
   */
  public async updateComponent(params: MCPUpdateComponentParams): Promise<MCPToolResult> {
    return this.executeTool(() => mcpCanvasToolsService.updateComponent(params));
  }

  /**
   * 选中组件
   */
  public async selectComponent(params: MCPSelectComponentParams): Promise<MCPToolResult> {
    return this.executeTool(() => mcpCanvasToolsService.selectComponent(params));
  }

  /**
   * 移动组件
   */
  public async moveComponent(params: MCPMoveComponentParams): Promise<MCPToolResult> {
    return this.executeTool(() => mcpCanvasToolsService.moveComponent(params));
  }

  /**
   * 复制组件
   */
  public async copyComponent(params: { id: Id }): Promise<MCPToolResult> {
    return this.executeTool(() => mcpCanvasToolsService.copyComponent(params.id));
  }

  /**
   * 粘贴组件
   */
  public async pasteComponent(position?: { x: number; y: number }): Promise<MCPToolResult> {
    return this.executeTool(() => mcpCanvasToolsService.pasteComponent(position));
  }

  /**
   * 居中对齐组件
   */
  public async alignCenter(params: { id: Id }): Promise<MCPToolResult> {
    return this.executeTool(() => mcpCanvasToolsService.alignCenter(params.id));
  }

  // ========== 查询工具 ==========

  /**
   * 获取组件信息
   */
  public getComponentInfo(params: { id: Id }): MCPToolResult {
    try {
      const data = mcpCanvasToolsService.getComponentInfo(params.id);
      return {
        success: true,
        data,
      };
    }
    catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * 获取画布状态
   */
  public getCanvasState(): MCPToolResult {
    try {
      const data = mcpCanvasToolsService.getCanvasState();
      return {
        success: true,
        data,
      };
    }
    catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * 获取页面结构
   */
  public getPageStructure(): MCPToolResult {
    try {
      const data = mcpCanvasToolsService.getPageStructure();
      return {
        success: true,
        data,
      };
    }
    catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  // ========== 历史操作工具 ==========

  /**
   * 撤销操作
   */
  public async undo(): Promise<MCPToolResult> {
    return this.executeTool(() => mcpCanvasToolsService.undo());
  }

  /**
   * 重做操作
   */
  public async redo(): Promise<MCPToolResult> {
    return this.executeTool(() => mcpCanvasToolsService.redo());
  }

  public getTools(): Record<string, (args: any) => Promise<any> | any> {
    return {
      addComponent: this.addComponent.bind(this),
      removeComponent: this.removeComponent.bind(this),
      updateComponent: this.updateComponent.bind(this),
      selectComponent: this.selectComponent.bind(this),
      moveComponent: this.moveComponent.bind(this),
      copyComponent: this.copyComponent.bind(this),
      pasteComponent: this.pasteComponent.bind(this),
      alignCenter: this.alignCenter.bind(this),
      getComponentInfo: this.getComponentInfo.bind(this),
      getCanvasState: this.getCanvasState.bind(this),
      getPageStructure: this.getPageStructure.bind(this),
      undo: this.undo.bind(this),
      redo: this.redo.bind(this),
    };
  }

  // ========== 通用工具调用接口 ==========
  /**
   * 通用工具调用方法
   * 支持通过工具名称和参数动态调用任何工具
   */
  public async callTool(toolName: string, params: any = {}): Promise<MCPToolResult> {
    switch (toolName) {
      case 'addComponent':
        return this.addComponent(params);
      case 'removeComponent':
        return this.removeComponent(params.id);
      case 'updateComponent':
        return this.updateComponent(params);
      case 'selectComponent':
        return this.selectComponent(params);
      case 'moveComponent':
        return this.moveComponent(params);
      case 'copyComponent':
        return this.copyComponent(params.id);
      case 'pasteComponent':
        return this.pasteComponent(params.position);
      case 'alignCenter':
        return this.alignCenter(params.id);
      case 'getComponentInfo':
        return this.getComponentInfo(params.id);
      case 'getCanvasState':
        return this.getCanvasState();
      case 'getPageStructure':
        return this.getPageStructure();
      case 'undo':
        return this.undo();
      case 'redo':
        return this.redo();
      default:
        return {
          success: false,
          error: `未知的工具: ${toolName}`,
        };
    }
  }
}

// 导出默认实例
const mcpCanvasTools = new MCPCanvasTools();
export default mcpCanvasTools;

// 导出类型和接口
export type {
  MCPAddComponentParams,
  MCPCanvasState,
  MCPComponentInfo,
  MCPMoveComponentParams,
  MCPSelectComponentParams,
  MCPUpdateComponentParams,
};
