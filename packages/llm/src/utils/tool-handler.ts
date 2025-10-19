/**
 * 工具调用处理工具
 */

export interface ToolCall {
  id: string;
  type: string;
  function: {
    name: string;
    arguments: string;
  };
}

export interface ToolCallHandler {
  [toolName: string]: (args: any) => Promise<string> | string;
}

/**
 * 工具调用聚合器
 * 用于将流式响应中分散的工具调用信息聚合成完整的工具调用
 */
export class ToolCallAggregator {
  private toolCalls: (ToolCall | null)[] = [];
  private handlers: ToolCallHandler = {};

  constructor(handlers: ToolCallHandler = {}) {
    this.handlers = handlers;
  }

  /**
   * 注册工具处理函数
   * @param toolName 工具名称
   * @param handler 处理函数
   */
  registerHandler(toolName: string, handler: (args: any) => Promise<string> | string) {
    this.handlers[toolName] = handler;
  }

  /**
   * 处理工具调用块（仅聚合，不执行）
   * @param toolCallChunks 工具调用块数组
   * @returns 是否有完整的工具调用可以执行
   */
  processToolCallChunks(toolCallChunks: any[]): boolean {
    console.log('🔧 开始处理工具调用块:', toolCallChunks);

    for (const toolCall of toolCallChunks) {
      const index = toolCall.index || 0;
      console.log(`📝 处理索引 ${index} 的工具调用块:`, toolCall);

      // 初始化或获取当前工具调用
      if (!this.toolCalls[index]) {
        this.toolCalls[index] = {
          id: toolCall.id || `tool_call_${index}_${Date.now()}`, // 确保 ID 不为空
          type: toolCall.type || 'function',
          function: {
            name: toolCall.function?.name || '',
            arguments: toolCall.function?.arguments || '',
          },
        };
        console.log(`✨ 初始化工具调用 ${index}:`, this.toolCalls[index]);
      }
      else {
        const current = this.toolCalls[index]!;

        // 累积函数参数
        if (toolCall.function?.arguments) {
          current.function.arguments += toolCall.function.arguments;
          console.log(`📝 累积参数，当前参数: "${current.function.arguments}"`);
        }

        // 更新其他字段
        if (toolCall.id && !current.id) {
          current.id = toolCall.id;
          console.log(`🆔 更新ID: ${current.id}`);
        }
        if (toolCall.type) {
          current.type = toolCall.type;
          console.log(`📋 更新类型: ${current.type}`);
        }
        if (toolCall.function?.name) {
          current.function.name = toolCall.function.name;
          console.log(`🏷️ 更新函数名: ${current.function.name}`);
        }
      }
    }

    // 输出当前状态
    console.log('📊 当前工具调用状态:', this.getDebugInfo());

    // 检查是否有完整的工具调用可以执行
    const readyToolCalls = this.getReadyToolCalls();
    console.log(`✅ 检查到 ${readyToolCalls.length} 个准备就绪的工具调用`);

    return readyToolCalls.length > 0;
  }

  /**
   * 获取准备好的工具调用
   */
  getReadyToolCalls(): ToolCall[] {
    const ready = this.toolCalls.filter((tc): tc is ToolCall =>
      tc !== null
      && tc.id !== '' // 确保 ID 不为空
      && tc.function?.name !== ''
      && tc.function?.arguments !== null
      && tc.function?.arguments !== undefined
      && (tc.function?.arguments === '' || this.isValidJSON(tc.function.arguments))
      && !(tc as any)._executed,
    );

    console.log(`🔍 ToolCallAggregator.getReadyToolCalls: 总共 ${this.toolCalls.length} 个工具调用，${ready.length} 个就绪`);

    // 为不就绪的工具调用提供详细诊断信息
    const notReady = this.toolCalls.filter((tc) => {
      if (tc === null)
        return true;
      if (tc.id === '')
        return true;
      if (tc.function?.name === '')
        return true;
      if (tc.function?.arguments === null)
        return true;
      if (tc.function?.arguments === undefined)
        return true;
      if (tc.function?.arguments === '' || this.isValidJSON(tc.function.arguments))
        return true;
      if ((tc as any)._executed)
        return true;
      return false;
    });

    if (notReady.length > 0) {
      console.log(`⚠️ 有 ${notReady.length} 个工具调用不就绪:`, notReady.map((tc, index) => ({
        index,
        isNull: tc === null,
        hasId: tc ? tc.id !== '' : false,
        hasName: tc ? tc.function?.name !== '' : false,
        hasArgs: tc ? tc.function?.arguments !== null && tc.function?.arguments !== undefined : false,
        isValidJSON: tc ? tc.function?.arguments === '' || this.isValidJSON(tc.function?.arguments || '') : false,
        isExecuted: tc ? (tc as any)._executed : false,
        toolCall: tc,
      })));
    }

    return ready;
  }

  /**
   * 执行所有准备好的工具调用
   * @returns 工具执行结果数组
   */
  async executeReadyToolCalls(): Promise<{ toolCall: ToolCall; result: string }[]> {
    const readyToolCalls = this.getReadyToolCalls();
    const results: { toolCall: ToolCall; result: string }[] = [];

    for (const toolCall of readyToolCalls) {
      try {
        const result = await this.executeToolCall(toolCall);
        if (result) {
          results.push({ toolCall, result });
          // 标记为已执行
          (toolCall as any)._executed = true;
        }
      }
      catch (error) {
        console.error(`执行工具 ${toolCall.function.name} 失败:`, error);
        const errorResult = `❌ 工具调用失败: ${error}`;
        results.push({ toolCall, result: errorResult });
        // 即使失败也标记为已执行，避免重复尝试
        (toolCall as any)._executed = true;
      }
    }

    return results;
  }

  /**
   * 执行工具调用
   * @param toolCall 工具调用对象
   * @returns 执行结果
   */
  private async executeToolCall(toolCall: ToolCall): Promise<string | null> {
    const { name, arguments: argsStr } = toolCall.function;

    try {
      console.log(`🔧 准备执行工具: ${name}, 参数: ${argsStr}`);

      const args = argsStr ? JSON.parse(argsStr) : {};
      console.log(`🛠️ 调用工具: ${name}`, args);

      const handler = this.handlers[name];
      if (!handler) {
        console.warn(`未找到工具处理函数: ${name}`);
        return `⚠️ 未知工具: ${name}`;
      }

      const result = await handler(args);
      if (typeof result !== 'string') {
        return JSON.stringify(result); // 确保返回字符串格式
      }
      console.log(`✅ 工具执行结果:`, JSON.stringify(result));
      return result;
    }
    catch (error) {
      console.error('解析工具调用参数失败:', error, argsStr);
      throw new Error(`参数解析失败: ${error}`);
    }
  }

  /**
   * 验证字符串是否为有效的 JSON
   * @param str 要验证的字符串
   * @returns 是否为有效 JSON
   */
  private isValidJSON(str: string): boolean {
    if (!str || str.trim() === '') {
      return false;
    }

    try {
      JSON.parse(str);
      return true;
    }
    catch {
      return false;
    }
  }

  /**
   * 重置工具调用状态
   */
  reset() {
    this.toolCalls = [];
  }

  /**
   * 获取当前工具调用状态
   */
  getToolCalls() {
    return this.toolCalls.filter((tc): tc is ToolCall => tc !== null);
  }

  /**
   * 获取当前工具调用状态（用于调试）
   */
  getDebugInfo() {
    return this.toolCalls.map((tc, index) => ({
      index,
      toolCall: tc,
      isComplete: tc !== null && tc.function?.name !== '' && tc.function?.arguments !== '',
      isValidJSON: tc !== null && this.isValidJSON(tc.function?.arguments || ''),
      hasExecuted: tc ? (tc as any)._executed : false,
    }));
  }
}
