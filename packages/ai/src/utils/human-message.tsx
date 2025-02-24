import type { MessageContent } from '@langchain/core/messages';
import { HumanMessage } from '@langchain/core/messages';

interface HumanMessageType {
  content: MessageContent;
  model: string;
}

export async function humanMessageFormatter({
  content,
}: HumanMessageType) {
  return new HumanMessage({
    content,
  });
}
