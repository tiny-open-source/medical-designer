/**
 * 多步工具链调用测试示例
 */

import type { ChatHistory, Message } from '../composables/chat';

/**
 * 模拟聊天接口类型
 */
interface MockChatInterface {
  onSubmit: (options: { message: string }) => Promise<{ success: boolean; message: string }>;
  streaming: { value: boolean };
  toolCallInProgress: { value: boolean };
  messages: { value: Message[] };
  history: { value: ChatHistory };
  isProcessing: { value: boolean };
}

/**
 * 测试多步工具链调用的示例
 */
export function createToolChainExample() {
  // 模拟的聊天接口（在实际使用中应该使用 useEnhancedMessageOption）
  const mockChat: MockChatInterface = {
    onSubmit: async (options: { message: string }) => {
      console.log('🤖 模拟聊天调用:', options.message);
      return { success: true, message: '模拟响应' };
    },
    streaming: { value: false },
    toolCallInProgress: { value: false },
    messages: { value: [] as Message[] },
    history: { value: [] as ChatHistory },
    isProcessing: { value: false },
  };

  // 测试用例 1：位置 → 天气工具链
  const testLocationWeatherChain = async () => {
    console.log('🧪 测试用例 1：位置 → 天气工具链');

    const result = await mockChat.onSubmit({
      message: '我想知道我这里的天气怎么样',
    });

    console.log('✅ 结果:', result);
    return result;
  };

  // 测试用例 2：多步计算链
  const testCalculationChain = async () => {
    console.log('🧪 测试用例 2：多步计算链');

    const result = await mockChat.onSubmit({
      message: '帮我计算 (15 + 25) × 2 然后再除以 4',
    });

    console.log('✅ 结果:', result);
    return result;
  };

  // 测试用例 3：复杂工具链（位置 → 天气 → 时间）
  const testComplexChain = async () => {
    console.log('🧪 测试用例 3：复杂工具链');

    const result = await mockChat.onSubmit({
      message: '告诉我现在几点了，我在哪里，以及当地的天气如何',
    });

    console.log('✅ 结果:', result);
    return result;
  };

  // 测试用例 4：单轮工具调用（对比）
  const testSingleTool = async () => {
    console.log('🧪 测试用例 4：单轮工具调用');

    const result = await mockChat.onSubmit({
      message: '现在几点了？',
    });

    console.log('✅ 结果:', result);
    return result;
  };

  return {
    testLocationWeatherChain,
    testCalculationChain,
    testComplexChain,
    testSingleTool,
    // 聊天状态
    streaming: mockChat.streaming,
    toolCallInProgress: mockChat.toolCallInProgress,
    messages: mockChat.messages,
    history: mockChat.history,
  };
}

/**
 * 工具链使用示例
 */
export const toolChainExamples = {
  // 示例 1：智能天气助手
  weatherAssistant: {
    description: '智能天气助手，自动获取位置并查询天气',
    userInputs: [
      '我想知道现在的天气怎么样',
      '今天天气如何？',
      '我这里会下雨吗？',
    ],
    expectedFlow: [
      '1. 调用 get_location() 获取用户位置',
      '2. 调用 get_weather(location) 查询天气',
      '3. 生成自然语言天气报告',
    ],
  },

  // 示例 2：计算助手
  calculationAssistant: {
    description: '多步数学计算助手',
    userInputs: [
      '帮我算一下 (10 + 5) × 3 然后减去 20',
      '计算 100 除以 4 的结果再乘以 3',
      '求 2 的 3 次方加上 5 的平方',
    ],
    expectedFlow: [
      '1. 分解复杂表达式',
      '2. 逐步调用 calculate() 工具',
      '3. 整合所有计算结果',
    ],
  },

  // 示例 3：综合信息助手
  infoAssistant: {
    description: '综合信息查询助手',
    userInputs: [
      '告诉我现在的时间、位置和天气',
      '我需要知道现在几点，在哪里，以及天气如何',
    ],
    expectedFlow: [
      '1. 调用 get_time() 获取当前时间',
      '2. 调用 get_location() 获取用户位置',
      '3. 调用 get_weather(location) 查询天气',
      '4. 生成综合信息报告',
    ],
  },
};

/**
 * 工具链调试辅助函数
 */
export const debugToolChain = {
  // 监控工具调用状态
  monitorToolCalls: (chat: MockChatInterface) => {
    console.log('🔍 当前聊天状态:', {
      streaming: chat.streaming.value,
      isProcessing: chat.isProcessing.value,
      toolCallInProgress: chat.toolCallInProgress.value,
      messageCount: chat.messages.value.length,
      historyCount: chat.history.value.length,
    });
  },

  // 打印消息历史
  printMessageHistory: (chat: MockChatInterface) => {
    console.log('📜 消息历史:');
    chat.messages.value.forEach((msg: Message, index: number) => {
      console.log(`${index + 1}. [${msg.isBot ? 'Bot' : 'User'}] ${msg.message}`);
    });
  },

  // 打印对话历史
  printConversationHistory: (chat: MockChatInterface) => {
    console.log('💬 对话历史:');
    chat.history.value.forEach((item: ChatHistory[0], index: number) => {
      console.log(`${index + 1}. [${item.role}] ${item.content}`);
    });
  },
};

/**
 * 性能测试工具
 */
export const performanceTest = {
  // 测试工具链调用性能
  measureToolChainPerformance: async (
    chat: MockChatInterface,
    message: string,
  ) => {
    const startTime = performance.now();

    console.log(`⏱️ 开始性能测试: "${message}"`);

    const result = await chat.onSubmit({ message });

    const endTime = performance.now();
    const duration = endTime - startTime;

    console.log(`⏱️ 性能测试完成:`, {
      message,
      duration: `${duration.toFixed(2)}ms`,
      success: result.success,
      toolCallsUsed: chat.toolCallInProgress.value,
    });

    return { result, duration };
  },

  // 批量性能测试
  batchPerformanceTest: async (
    chat: MockChatInterface,
    messages: string[],
  ) => {
    const results = [];

    for (const message of messages) {
      const testResult = await performanceTest.measureToolChainPerformance(chat, message);
      results.push(testResult);

      // 等待一段时间再进行下一个测试
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    const avgDuration = results.reduce((sum, r) => sum + r.duration, 0) / results.length;

    console.log('📊 批量测试结果:', {
      totalTests: results.length,
      averageDuration: `${avgDuration.toFixed(2)}ms`,
      successRate: `${(results.filter(r => r.result.success).length / results.length * 100).toFixed(1)}%`,
    });

    return results;
  },
};
