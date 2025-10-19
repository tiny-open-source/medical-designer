/**
 * 工具调用错误诊断工具
 */

export interface ToolCallDiagnostics {
  toolCall: any;
  issues: string[];
  isValid: boolean;
}

export interface MessageDiagnostics {
  message: any;
  issues: string[];
  isValid: boolean;
}

/**
 * 诊断工具调用数据的完整性
 */
export function diagnoseToolCall(toolCall: any): ToolCallDiagnostics {
  const issues: string[] = [];

  // 检查基本结构
  if (!toolCall) {
    issues.push('工具调用对象为空');
    return { toolCall, issues, isValid: false };
  }

  // 检查 ID
  if (!toolCall.id || toolCall.id === '') {
    issues.push('缺少有效的工具调用 ID');
  }

  // 检查类型
  if (!toolCall.type || toolCall.type !== 'function') {
    issues.push('工具调用类型不正确，应为 "function"');
  }

  // 检查函数信息
  if (!toolCall.function) {
    issues.push('缺少函数信息');
  }
  else {
    // 检查函数名
    if (!toolCall.function.name || toolCall.function.name === '') {
      issues.push('缺少函数名');
    }

    // 检查参数
    if (toolCall.function.arguments === undefined || toolCall.function.arguments === null) {
      issues.push('缺少函数参数');
    }
    else if (typeof toolCall.function.arguments !== 'string') {
      issues.push('函数参数应为字符串类型');
    }
    else {
      // 检查 JSON 有效性
      try {
        JSON.parse(toolCall.function.arguments);
      }
      catch {
        issues.push('函数参数不是有效的 JSON 格式');
      }
    }
  }

  return {
    toolCall,
    issues,
    isValid: issues.length === 0,
  };
}

/**
 * 诊断消息数据的完整性
 */
export function diagnoseMessage(message: any): MessageDiagnostics {
  const issues: string[] = [];

  if (!message) {
    issues.push('消息对象为空');
    return { message, issues, isValid: false };
  }

  // 检查消息类型
  const messageType = message.constructor?.name || typeof message;

  if (messageType === 'AIMessage') {
    // 检查 AI 消息
    if (message.content === undefined || message.content === null) {
      issues.push('AI 消息缺少内容');
    }

    // 检查工具调用
    if (message.additional_kwargs?.tool_calls) {
      const toolCalls = message.additional_kwargs.tool_calls;
      if (!Array.isArray(toolCalls)) {
        issues.push('tool_calls 应为数组');
      }
      else {
        for (let i = 0; i < toolCalls.length; i++) {
          const toolCallDiag = diagnoseToolCall(toolCalls[i]);
          if (!toolCallDiag.isValid) {
            issues.push(`工具调用 ${i}: ${toolCallDiag.issues.join(', ')}`);
          }
        }
      }
    }
  }
  else if (messageType === 'ToolMessage') {
    // 检查工具消息
    if (message.content === undefined || message.content === null) {
      issues.push('工具消息缺少内容');
    }

    if (!message.tool_call_id || message.tool_call_id === '') {
      issues.push('工具消息缺少 tool_call_id');
    }

    if (!message.name || message.name === '') {
      issues.push('工具消息缺少 name 字段');
    }
  }
  else if (messageType === 'HumanMessage') {
    // 检查人类消息
    if (message.content === undefined || message.content === null) {
      issues.push('人类消息缺少内容');
    }
  }

  return {
    message,
    issues,
    isValid: issues.length === 0,
  };
}

/**
 * 诊断消息链的完整性
 */
export function diagnoseMessageChain(messages: any[]): {
  chainDiagnostics: MessageDiagnostics[];
  summary: {
    totalMessages: number;
    validMessages: number;
    invalidMessages: number;
    commonIssues: string[];
  };
} {
  const chainDiagnostics = messages.map(msg => diagnoseMessage(msg));

  const validMessages = chainDiagnostics.filter(d => d.isValid).length;
  const invalidMessages = chainDiagnostics.length - validMessages;

  // 统计常见问题
  const allIssues = chainDiagnostics.flatMap(d => d.issues);
  const issueCounts = allIssues.reduce((acc, issue) => {
    acc[issue] = (acc[issue] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const commonIssues = Object.entries(issueCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([issue, count]) => `${issue} (${count}次)`);

  return {
    chainDiagnostics,
    summary: {
      totalMessages: messages.length,
      validMessages,
      invalidMessages,
      commonIssues,
    },
  };
}

/**
 * 生成详细的诊断报告
 */
export function generateDiagnosticReport(messages: any[]): string {
  const diagnosis = diagnoseMessageChain(messages);

  let report = '🔍 工具调用诊断报告\n';
  report += `${'='.repeat(50)}\n\n`;

  // 总览
  report += `📊 总览:\n`;
  report += `- 总消息数: ${diagnosis.summary.totalMessages}\n`;
  report += `- 有效消息: ${diagnosis.summary.validMessages}\n`;
  report += `- 无效消息: ${diagnosis.summary.invalidMessages}\n\n`;

  // 常见问题
  if (diagnosis.summary.commonIssues.length > 0) {
    report += `⚠️ 常见问题:\n`;
    diagnosis.summary.commonIssues.forEach((issue) => {
      report += `- ${issue}\n`;
    });
    report += '\n';
  }

  // 详细问题
  const invalidMessages = diagnosis.chainDiagnostics.filter(d => !d.isValid);
  if (invalidMessages.length > 0) {
    report += `❌ 详细问题:\n`;
    invalidMessages.forEach((diag, index) => {
      const messageType = diag.message.constructor?.name || 'Unknown';
      report += `${index + 1}. ${messageType} 消息:\n`;
      diag.issues.forEach((issue) => {
        report += `   - ${issue}\n`;
      });
      report += '\n';
    });
  }

  // 建议
  report += `💡 修复建议:\n`;
  if (diagnosis.summary.commonIssues.some(issue => issue.includes('tool_call_id'))) {
    report += `- 确保 ToolMessage 包含有效的 tool_call_id\n`;
  }
  if (diagnosis.summary.commonIssues.some(issue => issue.includes('name'))) {
    report += `- 确保 ToolMessage 包含 name 字段\n`;
  }
  if (diagnosis.summary.commonIssues.some(issue => issue.includes('JSON'))) {
    report += `- 检查工具调用参数的 JSON 格式\n`;
  }
  if (diagnosis.summary.commonIssues.some(issue => issue.includes('ID'))) {
    report += `- 确保工具调用有唯一的 ID\n`;
  }

  return report;
}

/**
 * 验证工具调用配置
 */
export function validateToolConfiguration(toolConfig: any): {
  isValid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  if (!toolConfig) {
    issues.push('工具配置为空');
    return { isValid: false, issues };
  }

  // 检查类型
  if (toolConfig.type !== 'function') {
    issues.push('工具类型应为 "function"');
  }

  // 检查函数配置
  if (!toolConfig.function) {
    issues.push('缺少函数配置');
  }
  else {
    if (!toolConfig.function.name) {
      issues.push('缺少函数名');
    }

    if (!toolConfig.function.description) {
      issues.push('缺少函数描述');
    }

    if (!toolConfig.function.parameters) {
      issues.push('缺少参数配置');
    }
    else {
      const params = toolConfig.function.parameters;

      if (params.type !== 'object') {
        issues.push('参数类型应为 "object"');
      }

      if (!params.properties) {
        issues.push('缺少参数属性定义');
      }

      // 检查必需参数
      if (params.required && !Array.isArray(params.required)) {
        issues.push('required 字段应为数组');
      }
    }
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
}

/**
 * 调试工具调用流程的辅助函数
 */
export const toolCallDebugger = {
  /**
   * 在控制台输出详细的工具调用信息
   */
  logToolCall: (toolCall: any, prefix = '🔧') => {
    console.group(`${prefix} 工具调用详情`);
    console.log('ID:', toolCall.id);
    console.log('类型:', toolCall.type);
    console.log('函数名:', toolCall.function?.name);
    console.log('参数:', toolCall.function?.arguments);

    try {
      const args = JSON.parse(toolCall.function?.arguments || '{}');
      console.log('解析后的参数:', args);
    }
    catch {
      console.warn('⚠️ 参数 JSON 解析失败');
    }

    const diagnosis = diagnoseToolCall(toolCall);
    if (!diagnosis.isValid) {
      console.warn('⚠️ 发现问题:', diagnosis.issues);
    }

    console.groupEnd();
  },

  /**
   * 在控制台输出详细的消息信息
   */
  logMessage: (message: any, prefix = '💬') => {
    const messageType = message.constructor?.name || 'Unknown';
    console.group(`${prefix} ${messageType} 消息详情`);

    console.log('内容:', message.content);

    if (messageType === 'ToolMessage') {
      console.log('工具调用 ID:', message.tool_call_id);
      console.log('工具名称:', message.name);
    }
    else if (messageType === 'AIMessage' && message.additional_kwargs?.tool_calls) {
      console.log('工具调用:', message.additional_kwargs.tool_calls);
    }

    const diagnosis = diagnoseMessage(message);
    if (!diagnosis.isValid) {
      console.warn('⚠️ 发现问题:', diagnosis.issues);
    }

    console.groupEnd();
  },

  /**
   * 输出完整的诊断报告
   */
  generateReport: (messages: any[]) => {
    const report = generateDiagnosticReport(messages);
    console.log(report);
    return report;
  },
};
