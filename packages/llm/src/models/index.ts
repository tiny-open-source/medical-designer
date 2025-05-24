import type { ModelConfig, ModelSettings } from '../utils/storage';
import { isCustomModel } from '../db/models';
import { getOllamaURL } from '../service/ollama';
import { getCustomHeaders } from '../utils/clean-headers';
import { ChatOllama } from './ChatOllama';
import { CustomChatOpenAI } from './CustomChatOpenAI';

export interface ModelParams extends ModelSettings {
  model: ModelConfig;
}

/**
 * 创建页面助手模型实例
 * @param params 模型配置参数
 * @returns 聊天模型实例
 */
export async function pageAssistModel(params: ModelParams) {
  const {
    model,
    keepAlive,
    temperature,
    topK,
    topP,
    numCtx,
    seed,
    numGpu,
    numPredict,
    useMMap,
    minP,
    repeatLastN,
    repeatPenalty,
    tfsZ,
    numKeep,
    numThread,
    useMlock,
  } = params;

  const isCustom = isCustomModel(model.name!);
  if (isCustom) {
    return new CustomChatOpenAI({
      modelName: model.model,
      openAIApiKey: model.apiKey,
      temperature,
      topP,
      maxTokens: numPredict,
      configuration: {
        apiKey: model.apiKey,
        baseURL: model.customServiceProviderBaseUrl,
        defaultHeaders: getCustomHeaders({
          headers: [],
        }),
      },
    }) as any;
  }

  return new ChatOllama({
    baseUrl: getOllamaURL(),
    keepAlive,
    temperature,
    topK,
    topP,
    numCtx,
    seed,
    model: model.model,
    numGpu,
    numPredict,
    useMMap,
    minP,
    repeatPenalty,
    repeatLastN,
    tfsZ,
    numKeep,
    numThread,
    useMlock,
  });
}
