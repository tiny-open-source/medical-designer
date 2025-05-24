import type { MessageContent } from '@langchain/core/messages';
import {
  AIMessage,
  HumanMessage,

} from '@langchain/core/messages';
import { isCustomModel } from '../db/models';
import { removeReasoning } from '../libs/reasoning';

export function generateHistory(messages: {
  role: 'user' | 'assistant' | 'system';
  content: string;
  image?: string;
}[], model: string) {
  const history = [];
  const isCustom = isCustomModel(model);
  console.log('isCustom,', isCustom);

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
      console.log('content', content);

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
