import type { ModelType } from './constants';
import { useLocalStorage as _useLocalStorage } from '@vueuse/core';
import mustache from 'mustache';
import { getOllamaURL } from '../service/ollama';

export interface ModelConfig {
  model?: string;
  value?: string;
  provider?: string;
  label?: string;
  name?: string;
  ollamaUrl?: string;
  customServiceProvider?: string;
  customServiceProviderName?: string;
  customServiceProviderBaseUrl?: string;
  apiKey?: string;
  prompt?: string;
  visionEnabled?: boolean;
  modelId?: string | number;
}

export interface ModelSettings {
  f16KV?: boolean;
  frequencyPenalty?: number;
  keepAlive?: string;
  logitsAll?: boolean;
  mirostat?: number;
  mirostatEta?: number;
  mirostatTau?: number;
  numBatch?: number;
  numCtx?: number;
  numGpu?: number;
  numGqa?: number;
  numKeep?: number;
  numPredict?: number;
  numThread?: number;
  penalizeNewline?: boolean;
  seed?: number;
  presencePenalty?: number;
  repeatLastN?: number;
  repeatPenalty?: number;
  ropeFrequencyBase?: number;
  ropeFrequencyScale?: number;
  temperature?: number;
  tfsZ?: number;
  topK?: number;
  topP?: number;
  typicalP?: number;
  useMLock?: boolean;
  useMMap?: boolean;
  vocabOnly?: boolean;
  minP?: number;
  useMlock?: boolean;
}

// 多模型配置接口
export interface MultiModelConfig {
  [ModelType.MAIN]?: ModelConfig;
  [ModelType.VISION]?: ModelConfig;
  // 可扩展更多模型类型
  [key: string]: ModelConfig | undefined;
}

// 存储键名常量
export const STORAGE_KEYS = {
  MULTI_MODEL_CONFIG: 'multiModelConfig',
};

/**
 * 创建一个封装了localStorage的类型安全的状态存储
 * @param key 存储的键名
 * @param initialValue 初始值
 * @returns 响应式存储对象
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  return _useLocalStorage<T>(key, initialValue, {
    mergeDefaults: true,
  });
}

/**
 * 获取多模型配置存储对象
 * @returns 多模型配置存储
 */
export function useMultiModel() {
  return useLocalStorage<MultiModelConfig>(STORAGE_KEYS.MULTI_MODEL_CONFIG, {
    mainModel: {
      ollamaUrl: getOllamaURL(),
      model: '',
      value: '',
      provider: '',
      label: '',
      name: '',
      modelId: '',
      customServiceProvider: 'custom',
      customServiceProviderName: '',
      customServiceProviderBaseUrl: '',
      apiKey: '',
      prompt: '',
    },
    visionModel: {
      ollamaUrl: getOllamaURL(),
      model: '',
      value: '',
      provider: '',
      label: '',
      name: '',
      modelId: '',
      customServiceProvider: 'custom',
      customServiceProviderName: '',
      customServiceProviderBaseUrl: '',
      apiKey: '',
      prompt: '',
      visionEnabled: true,
    },
  });
}

/**
 * 合并模型配置
 * @param baseSettings 基础配置
 * @param overrideSettings 覆盖配置
 * @returns 合并后的配置
 */
export function mergeModelSettings(baseSettings: ModelSettings = {}, overrideSettings: ModelSettings = {}): ModelSettings {
  return { ...baseSettings, ...overrideSettings };
}

/**
 * 处理提示词模板
 * @param template 提示词模板对象
 * @param variables 变量值对象
 * @returns 处理后的提示词字符串
 */
export function processPromptTemplate(template: string, variables: Record<string, string> = {}): string {
  if (!template) {
    return '';
  }
  try {
    // 使用mustache库渲染模板，将变量替换为实际值
    return mustache.render(template, variables);
  }
  catch (error) {
    console.error('处理提示词模板时出错:', error);
    return template; // 发生错误时返回原始模板
  }
}
