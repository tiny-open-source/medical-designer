import type { MessageContent } from '@langchain/core/messages';
import {
  AIMessage,
  HumanMessage,

} from '@langchain/core/messages';
import { removeReasoning } from '../libs/reasoning';

export function generateHistory(messages: {
  role: 'user' | 'assistant' | 'system';
  content: string;
  image?: string;
}[], model: string) {
  console.log(model);
  const history = [];

  const isCustom = false;
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
      history.push(
        new AIMessage({
          content: isCustom
            ? removeReasoning(message.content)
            : [
                {
                  type: 'text',
                  text: removeReasoning(message.content),
                },
              ],
        }),
      );
    }
  }
  return history;
}
