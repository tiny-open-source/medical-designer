import type { MessageContent } from '@langchain/core/messages';
import {
  AIMessage,
  HumanMessage,
  ToolMessage,
} from '@langchain/core/messages';
import { isCustomModel } from '../db/models';
import { removeReasoning } from '../libs/reasoning';

export function generateHistory(messages: {
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  image?: string;
  toolCallId?: string;
  toolName?: string;
  // 新增：用于恢复assistant消息中的工具调用信息
  toolCalls?: Array<{
    id: string;
    type: 'function';
    function: {
      name: string;
      arguments: string;
    };
  }>;
}[], model: string) {
  const history = [];
  const isCustom = isCustomModel(model);

  for (const message of messages) {
    if (message.role === 'user') {
      let content: MessageContent = isCustom
        ? message.content
        : [
            {
              type: 'text',
              text: message.content,
            },
          ];

      if (message.image) {
        content = [
          {
            type: 'image_url',
            image_url: !isCustom
              ? message.image
              : {
                  url: message.image,
                },
          },
          {
            type: 'text',
            text: message.content,
          },
        ];
      }

      history.push(
        new HumanMessage({
          content,
        }),
      );
    }
    else if (message.role === 'assistant') {
      // 确保即使是空内容的 assistant 消息也被恢复（可能只包含工具调用）
      const content = message.content || '';

      // 构建 additional_kwargs，包含工具调用信息
      let additional_kwargs: any;

      if (message.toolCalls && message.toolCalls.length > 0) {
        // 从 toolCalls 字段恢复工具调用信息
        additional_kwargs = {
          tool_calls: message.toolCalls,
        };
      }
      else if (message.toolName && message.toolCallId) {
        // 兼容旧格式：从 toolName 和 toolCallId 字段恢复
        additional_kwargs = {
          tool_calls: [
            {
              function: {
                name: message.toolName,
                arguments: message.toolCallId, // 注意：这里可能是错误的，应该是arguments而不是id
              },
              id: message.toolCallId,
              type: 'function',
            },
          ],
        };
      }

      history.push(
        new AIMessage({
          content: isCustom
            ? removeReasoning(content)
            : [
                {
                  type: 'text',
                  text: removeReasoning(content),
                },
              ],
          additional_kwargs,
        }),
      );
    }
    else if (message.role === 'tool') {
      // 处理工具调用结果消息
      if (message.toolCallId && message.toolName) {
        history.push(
          new ToolMessage(
            message.content,
            message.toolCallId,
            message.toolName,
          ),
        );
      }
      else {
        console.warn('工具调用消息缺少必要信息:', message);
      }
    }
    else {
      console.warn('⚠️ 未识别的消息角色:', message.role, message);
    }
  }

  return history;
}
