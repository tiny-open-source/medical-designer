import type { ComputedRef, Ref } from 'vue';
import type { ModelParams } from '../models';
import type { ModelConfig } from '../utils/storage';
import { SystemMessage } from '@langchain/core/messages';
import { computed, reactive, toRefs } from 'vue';
import { generateID } from '../db';
import { isReasoningEnded, isReasoningStarted, mergeReasoningContent } from '../libs/reasoning';
import { pageAssistModel } from '../models';
import { getAllDefaultModelSettings } from '../service/model-settings';
import { generateHistory } from '../utils/generate-history';
import { humanMessageFormatter } from '../utils/human-message';

export interface Message {
  isBot: boolean;
  name: string;
  message: string;
  sources: any[];
  images?: string[];
  reasoning_time_taken?: number;
  id?: string;
  messageType?: string;
  generationInfo?: any;
}

export type ChatHistory = {
  role: 'user' | 'assistant' | 'system';
  content: string;
  image?: string;
  messageType?: string;
}[];

export interface MessageOptions {
  prompt?: Ref<string> | ComputedRef<string>;
  initialMessages?: Message[];
  initialHistory?: ChatHistory;
  onMessageUpdate?: (message: Message) => void;
  onHistoryUpdate?: (history: ChatHistory) => void;
  onError?: (error: Error) => void;
  maxHistoryLength?: number;
}

export interface ChatSubmitOptions {
  message: string;
  image?: string;
  isRegenerate?: boolean;
  messages?: Ref<Message[]>;
  memory?: ChatHistory;
  controller?: AbortController;
  retainContext?: boolean;
}

/**
 * 创建聊天对话处理钩子
 * @param model 模型配置
 * @param options 模型选项
 * @returns 聊天对话处理方法和状态
 */
export function useMessageOption(model: ComputedRef<ModelConfig>, options: MessageOptions = {}) {
  // 提取选项参数
  const {
    initialMessages = [],
    initialHistory = [],
    onMessageUpdate,
    onHistoryUpdate,
    onError,
    maxHistoryLength = 100,
  } = options;

  // 状态管理 - 使用响应式对象统一管理状态
  const chatState = reactive({
    streaming: false,
    isProcessing: false,
    messages: initialMessages as Message[],
    history: initialHistory as ChatHistory,
    lastError: null as Error | null,
  });

  // 提供状态的引用版本
  const { streaming, isProcessing, messages, history, lastError } = toRefs(chatState);

  const hasMessages = computed(() => messages.value.length > 0);

  // 控制器
  let abortController: AbortController | undefined;

  /**
   * 更新消息列表
   * @param newMessages 消息列表
   */
  const setMessages = (newMessages: Message[]) => {
    chatState.messages = newMessages;
    onMessageUpdate?.(newMessages[newMessages.length - 1]);
  };

  /**
   * 更新历史记录
   * @param value 历史记录
   */
  const setHistory = (value: ChatHistory) => {
    // 限制历史记录长度
    if (maxHistoryLength && value.length > maxHistoryLength) {
      chatState.history = value.slice(-maxHistoryLength);
    }
    else {
      chatState.history = value;
    }
    onHistoryUpdate?.(chatState.history);
  };

  /**
   * 停止流式请求
   */
  const stopStreamingRequest = () => {
    if (abortController) {
      abortController.abort();
      abortController = undefined;
      chatState.streaming = false;
      chatState.isProcessing = false;
    }
  };

  /**
   * 常规聊天模式处理
   * @param message 消息内容
   * @param image 图片内容
   * @param isRegenerate 是否重新生成
   * @param messages 消息状态
   * @param history 历史记录状态
   * @param signal 中断信号
   * @param retainContext 保持上下文不清空
   */
  const normalChatMode = async (
    message: string,
    image: string = '',
    isRegenerate: boolean = false,
    messagesRef: Ref<Message[]>,
    historyRef: Ref<ChatHistory>,
    signal: AbortSignal,
    retainContext: boolean = true,
  ) => {
    console.log('normalChatMode:', message);

    const userDefaultModelSettings = await getAllDefaultModelSettings();

    if (image && image.length > 0 && !image.startsWith('data:')) {
      image = `data:image/jpeg;base64,${image.split(',')[1]}`;
    }

    // 合并模型设置
    const modelParams: ModelParams = {
      // 使用模型配置
      model: model.value,
      // 默认配置
      keepAlive: undefined,
      temperature: 0.0,
      // 使用用户默认配置
      topK: userDefaultModelSettings?.topK,
      topP: userDefaultModelSettings?.topP,
      numCtx: 8192, // 影响的是模型可以一次记住的最大 token 数量
      seed: undefined,
      numGpu: userDefaultModelSettings?.numGpu,
      numPredict: 4096, // 影响模型最大可以生成的 token 数量
      useMMap: userDefaultModelSettings?.useMMap,
      minP: userDefaultModelSettings?.minP,
      repeatLastN: userDefaultModelSettings?.repeatLastN,
      repeatPenalty: userDefaultModelSettings?.repeatPenalty,
      tfsZ: userDefaultModelSettings?.tfsZ,
      numKeep: userDefaultModelSettings?.numKeep,
      numThread: userDefaultModelSettings?.numThread,
      useMlock: userDefaultModelSettings?.useMlock,
    };

    try {
      const ollama = await pageAssistModel(modelParams);

      const generateMessageId = generateID();

      // 准备消息数据
      let newMessage: Message[] = [];
      if (!isRegenerate) {
        newMessage = [
          ...messagesRef.value,
          {
            isBot: false,
            name: 'You',
            message,
            images: image ? [image] : [],
            sources: [],
          },
          {
            isBot: true,
            name: model.value.model!,
            message: '▋',
            sources: [],
            id: generateMessageId,
          },
        ];
      }
      else {
        newMessage = [
          ...messagesRef.value,
          {
            isBot: true,
            name: model.value.model!,
            message: '▋',
            sources: [],
            id: generateMessageId,
          },
        ];
      }
      setMessages(newMessage);

      let fullText = '';
      let timetaken = 0;

      // 格式化人类消息
      let humanMessage = await humanMessageFormatter({
        content: [
          {
            text: message,
            type: 'text',
          },
        ],
        model: model.value.name!,
      });

      if (image && image.length > 0) {
        humanMessage = await humanMessageFormatter({
          content: [
            {
              text: message,
              type: 'text',
            },
            {
              image_url: image,
              type: 'image_url',
            },
          ],
          model: model.value!.name!,
        });
      }

      // 生成聊天历史
      const applicationChatHistory = generateHistory(historyRef.value, model.value.name!);

      // 添加系统提示
      if (model.value.prompt) {
        applicationChatHistory.unshift(
          new SystemMessage({
            content: model.value.prompt,
          }),
        );
      }

      let generationInfo: any | undefined;

      // 发起流式请求
      const chunks = await ollama.stream(
        [...applicationChatHistory, humanMessage],
        {
          signal,
          callbacks: [
            {
              handleLLMEnd(output: any): any {
                try {
                  generationInfo = output?.generations?.[0][0]?.generationInfo;
                }
                catch (e) {
                  console.error('handleLLMEnd error', e);
                }
              },
            },
          ],
        },
      );

      // 处理流式响应
      let count = 0;
      let reasoningStartTime: Date | null = null;
      let reasoningEndTime: Date | null = null;
      let apiReasoning: boolean = false;

      for await (const chunk of chunks) {
        if (chunk?.additional_kwargs?.reasoning_content) {
          const reasoningContent = mergeReasoningContent(
            fullText,
            chunk?.additional_kwargs?.reasoning_content as string || '',
          );
          fullText = reasoningContent;
          apiReasoning = true;
        }
        else {
          if (apiReasoning) {
            fullText += '</think>';
            apiReasoning = false;
          }
        }

        fullText += chunk?.content || '';

        // 计算推理时间
        if (isReasoningStarted(fullText) && !reasoningStartTime) {
          reasoningStartTime = new Date();
        }

        if (
          reasoningStartTime
          && !reasoningEndTime
          && isReasoningEnded(fullText)
        ) {
          reasoningEndTime = new Date();
          const reasoningTime = reasoningEndTime.getTime() - reasoningStartTime.getTime();
          timetaken = reasoningTime;
        }

        // 更新界面
        if (count === 0) {
          chatState.isProcessing = true;
        }

        // 更新消息内容
        setMessages(messagesRef.value.map((msg) => {
          if (msg.id === generateMessageId) {
            return {
              ...msg,
              message: `${fullText}▋`,
              reasoning_time_taken: timetaken,
            };
          }
          return msg;
        }));
        count++;
      }

      // 完成后更新最终消息
      setMessages(messagesRef.value.map((msg) => {
        if (msg.id === generateMessageId) {
          return {
            ...msg,
            message: fullText,
            generationInfo,
            reasoning_time_taken: timetaken,
          };
        }
        return msg;
      }));

      // 更新历史记录
      if (retainContext) {
        setHistory([
          ...historyRef.value,
          {
            role: 'user',
            content: message,
            image,
          },
          {
            role: 'assistant',
            content: fullText,
          },
        ]);
      }

      // 重置状态
      chatState.isProcessing = false;
      chatState.streaming = false;
      chatState.lastError = null;

      return {
        success: true,
        message: fullText,
        generationInfo,
      };
    }
    catch (e) {
      console.error('Chat error:', e);
      chatState.isProcessing = false;
      chatState.streaming = false;
      chatState.lastError = e instanceof Error ? e : new Error(String(e));

      // 调用错误回调
      if (onError && chatState.lastError) {
        onError(chatState.lastError);
      }

      return {
        success: false,
        error: chatState.lastError,
      };
    }
    finally {
      abortController = undefined;
    }
  };

  /**
   * 提交聊天消息
   * @param options 提交选项
   */
  const onSubmit = async ({
    message,
    image = '',
    isRegenerate = false,
    controller,
    retainContext = true,
  }: ChatSubmitOptions) => {
    if (!message.trim() && (!image || image.trim() === '')) {
      return { success: false, error: new Error('消息内容不能为空'), message: '' };
    }

    chatState.streaming = true;
    let signal: AbortSignal;

    // 创建或使用控制器
    if (!controller) {
      abortController = new AbortController();
      signal = abortController.signal;
    }
    else {
      abortController = controller;
      signal = controller.signal;
    }

    // 处理消息
    const res = await normalChatMode(
      message,
      image,
      isRegenerate,
      messages,
      history,
      signal,
      retainContext,
    );
    return res;
  };

  /**
   * 重置状态
   * @param keepHistory 是否保留历史记录
   */
  const resetState = (keepHistory: boolean = false) => {
    if (chatState.streaming) {
      stopStreamingRequest();
    }

    chatState.messages = [];
    if (!keepHistory) {
      chatState.history = [];
    }
    chatState.streaming = false;
    chatState.isProcessing = false;
    chatState.lastError = null;
  };

  /**
   * 添加系统消息
   * @param content 系统消息内容
   */
  const addSystemMessage = (content: string) => {
    setHistory([
      ...history.value,
      {
        role: 'system',
        content,
      },
    ]);
  };

  return {
    onSubmit,
    stopStreamingRequest,
    resetState,
    addSystemMessage,
    // 状态
    streaming,
    isProcessing,
    messages,
    history,
    lastError,
    hasMessages,
  };
}
