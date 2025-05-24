import type { StructuredToolInterface } from '@langchain/core/tools';
import type {
  OpenAI as OpenAIClient,
} from 'openai';
import {
  convertToOpenAIFunction,
  convertToOpenAITool,
} from '@langchain/core/utils/function_calling';
import {
  APIConnectionTimeoutError,
  APIUserAbortError,
} from 'openai';
import { zodToJsonSchema } from 'zod-to-json-schema';

export function wrapOpenAIClientError(e: any) {
  let error;
  if (e.constructor.name === APIConnectionTimeoutError.name) {
    error = new Error(e.message);
    error.name = 'TimeoutError';
  }
  else if (e.constructor.name === APIUserAbortError.name) {
    error = new Error(e.message);
    error.name = 'AbortError';
  }
  else {
    error = e;
  }
  return error;
}

export {
  convertToOpenAIFunction as formatToOpenAIFunction,
  convertToOpenAITool as formatToOpenAITool,
};

export function formatToOpenAIAssistantTool(tool: StructuredToolInterface) {
  return {
    type: 'function',
    function: {
      name: tool.name,
      description: tool.description,
      parameters: zodToJsonSchema(tool.schema),
    },
  };
}

export type OpenAIToolChoice =
  | OpenAIClient.ChatCompletionToolChoiceOption
  | 'any'
  | string;

export function formatToOpenAIToolChoice(
  toolChoice?: OpenAIToolChoice,
): OpenAIClient.ChatCompletionToolChoiceOption | undefined {
  if (!toolChoice) {
    return undefined;
  }
  else if (toolChoice === 'any' || toolChoice === 'required') {
    return 'required';
  }
  else if (toolChoice === 'auto') {
    return 'auto';
  }
  else if (toolChoice === 'none') {
    return 'none';
  }
  else if (typeof toolChoice === 'string') {
    return {
      type: 'function',
      function: {
        name: toolChoice,
      },
    };
  }
  else {
    return toolChoice;
  }
}
