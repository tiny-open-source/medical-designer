import type { SelectOption } from 'naive-ui';
import type {
  ModelConfig,
} from '../../utils/storage';
import { EditOutlined, EyeOutlined, SettingOutlined } from '@vicons/antd';
import hljs from 'highlight.js';
import MarkdownIt from 'markdown-it';
import {
  NButton,
  NCard,
  NDivider,
  NForm,
  NFormItem,
  NIcon,
  NInput,
  NSelect,
  NSpace,
  NSwitch,
  NTabPane,
  NTabs,
  useMessage,
  useModal,
} from 'naive-ui';
import { computed, defineComponent, onBeforeMount, ref, watch } from 'vue';
import { generateID } from '../../db/models';
import { getAllOpenAIModels } from '../../libs/openai';
import { getAllModels, setOllamaURL } from '../../service/ollama';
import { MODEL_TYPE_LABELS, ModelType } from '../../utils/constants';
import { OAI_API_PROVIDERS } from '../../utils/oai-api-providers';
import {
  processPromptTemplate,
  useMultiModel,
} from '../../utils/storage';
import { ProviderIcons } from '../ProviderIcon';

// 模型表单值接口
interface ModelFormValues extends ModelConfig {
  type: ModelType;
}

export default defineComponent({
  name: 'ChatConfig',
  emits: ['save'],
  setup(_, { emit }) {
    const modal = useModal();
    const message = useMessage();
    const formRef = ref<InstanceType<typeof NForm>>();
    const providerFormRef = ref<InstanceType<typeof NForm>>();

    const isFetchingModel = ref(true);
    const activeTab = ref<string>(ModelType.MAIN);

    // 多模型配置存储
    const multiModelConfig = useMultiModel();

    // 初始化markdown解析器
    const md = new MarkdownIt({
      html: false,
      linkify: true,
      typographer: true,
      highlight(str, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(str, { language: lang }).value;
          }
          catch {}
        }
        return ''; // 使用默认转义
      },
    });

    const renderMarkdown = (content: string) => {
      return md.render(content);
    };

    const previewResult = ref('');
    const variableValues = computed(() => {
      // 获取当前项目上下文数据
      // 准备变量值
      const variableValues: Record<string, string> = {

      };
      return variableValues;
    });

    // 创建表单值引用
    const formValues = ref<ModelFormValues>({
      type: ModelType.MAIN,
      ...(multiModelConfig.value.mainModel || {}),
    });

    // 本地和自定义模型
    const localModels = ref<any[]>([]);
    const customModels = ref<any[]>([]);
    const models = computed(() => {
      return [...localModels.value, ...customModels.value];
    });

    // 加载本地模型
    onBeforeMount(async () => {
      try {
        isFetchingModel.value = true;
        localModels.value = await getAllModels();
      }
      catch (error) {
        console.error('获取模型失败:', error);
        message.error('获取模型失败，请检查网络连接或API密钥');
      }
      finally {
        isFetchingModel.value = false;
      }
    });

    // 当 API 配置变化时，加载自定义模型
    watch(
      [() => formValues.value.customServiceProviderBaseUrl, () => formValues.value.apiKey],
      async () => {
        const baseUrl = formValues.value.customServiceProviderBaseUrl;
        const apiKey = formValues.value.apiKey;
        if (baseUrl && apiKey) {
          try {
            isFetchingModel.value = true;
            const openAiModels = await getAllOpenAIModels({
              baseUrl: formValues.value.customServiceProviderBaseUrl!,
              apiKey: formValues.value.apiKey,
            });
            customModels.value = openAiModels.map(model => ({
              name: `${model.id}_${generateID()}`,
              model: model.id,
              label: model.id,
              value: model.id,
              modified_at: '',
              provider:
                OAI_API_PROVIDERS.find(
                  provider => provider.value === model.id,
                )?.value || 'custom',
              size: 0,
              digest: '',
              details: {
                parent_model: '',
                format: '',
                family: '',
                families: [],
                parameter_size: '',
                quantization_level: '',
              },
            }));
          }
          catch (error) {
            console.error('获取模型失败:', error);
            message.error('获取模型失败，请检查网络连接或API密钥');
          }
          finally {
            isFetchingModel.value = false;
          }
        }
      },
      {
        immediate: true,
      },
    );

    // 当切换标签页时，切换表单值
    watch(
      () => activeTab.value,
      (newTab) => {
        formValues.value = {
          type: newTab as ModelType,
          ...(multiModelConfig.value[newTab as ModelType] || {}),
        };
        previewResult.value = '';
      },
    );

    // 表单验证规则
    const settingRules = {
      ollamaUrl: {
        required: true,
        trigger: ['input', 'blur'],
        message: '请输入 Ollama URL',
      },
    };

    // 服务提供商表单验证规则
    const settingProviderRules = {
      customServiceProviderName: {
        required: true,
        trigger: ['input', 'blur'],
        message: '请输入提供商名称',
      },
      customServiceProviderBaseUrl: {
        required: true,
        trigger: ['input', 'blur'],
        message: '请输入基础URL',
      },
    };

    // 渲染服务提供商表单
    const renderServiceProvider = () => (
      <div class="lc-llm-chat-header__settings">
        <NForm
          class="lc-llm-chat-header__settings-form"
          ref={providerFormRef}
          rules={settingProviderRules}
          model={formValues.value}
        >
          <NFormItem label="服务提供商" path="customServiceProvider">
            <NSelect
              value={formValues.value.customServiceProvider}
              options={OAI_API_PROVIDERS}
              onUpdateValue={(e) => {
                const value = OAI_API_PROVIDERS.find(
                  item => item.value === e,
                );
                formValues.value.customServiceProvider = value?.value;
                formValues.value.customServiceProviderName = value?.label;
                formValues.value.customServiceProviderBaseUrl
              = value?.baseUrl;
              }}
              renderLabel={(option: SelectOption) => (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <NIcon>
                    <ProviderIcons
                      provider={String(option.value)}
                      className="size-5"
                    />
                  </NIcon>
                  {option.label}
                </div>
              )}
            >
            </NSelect>
          </NFormItem>
          <NFormItem label="提供商名称" path="customServiceProviderName">
            <NInput
              value={formValues.value.customServiceProviderName || void 0}
              placeholder="输入提供商名称"
              onUpdateValue={(value) => {
                formValues.value.customServiceProviderName = value;
              }}
            />
          </NFormItem>
          <NFormItem label="基础 URL" path="customServiceProviderBaseUrl">
            <NInput
              value={formValues.value.customServiceProviderBaseUrl || void 0}
              placeholder="输入 基础 URL"
              onUpdateValue={(value) => {
                formValues.value.customServiceProviderBaseUrl = value;
              }}
            />
          </NFormItem>
          <NFormItem label="API 密钥" path="apiKey">
            <NInput
              type="password"
              showPasswordOn="click"
              value={formValues.value.apiKey || void 0}
              placeholder="输入 API 密钥"
              onUpdateValue={(value) => {
                formValues.value.apiKey = value;
              }}
            />
          </NFormItem>
        </NForm>
      </div>
    );

    // 处理添加服务提供商
    const handleServiceProviderAdd = () => {
      modal.create({
        preset: 'dialog',
        title: '添加服务提供商',
        content: renderServiceProvider,
        onPositiveClick: async () => {
          const res = await providerFormRef.value?.validate();
          if (res?.warnings) {
            console.log(res?.warnings);
            message.error('验证失败');
            return false;
          }
        },
        onNegativeClick: () => {
        },
        positiveText: '保存',
        negativeText: '取消',
      });
    };

    // 保存当前模型配置
    const saveCurrentModelConfig = async () => {
      const res = await formRef.value?.validate();
      if (!res?.warnings) {
        const modelType = formValues.value.type;
        const model = models.value.find(
          (model: any) => model.value === formValues.value.model,
        );
        const val = { ...formValues.value, type: undefined };
        // 保存设置到多模型配置
        console.log(`model`, model);
        console.log(`val`, val);

        // 保存模型到多模型配置
        if (model) {
          multiModelConfig.value[modelType] = { ...val, ...model };
        }

        message.success(`${MODEL_TYPE_LABELS[modelType]}配置已保存`);
        return true;
      }
      else {
        console.log(res?.warnings);
        message.error('验证失败');
        return false;
      }
    };

    // 渲染设置界面
    const renderSettings = () => (
      <NTabs type="line" animated value={activeTab.value} onUpdateValue={value => activeTab.value = value}>
        <NTabPane
          name={ModelType.MAIN}
          tab={(
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <NIcon><EditOutlined /></NIcon>
              {MODEL_TYPE_LABELS[ModelType.MAIN]}
            </div>
          )}
        >
          <div class="lc-llm-chat-header__settings">
            <NSpace vertical>
              <NButton onClick={handleServiceProviderAdd}>添加提供商</NButton>
              <NForm
                class="lc-llm-chat-header__settings-form"
                ref={formRef}
                rules={settingRules}
                model={formValues.value}
              >
                <NFormItem label="Ollama URL" path="ollamaUrl">
                  <NInput
                    value={formValues.value.ollamaUrl || void 0}
                    placeholder="输入 Ollama URL"
                    onUpdate:value={(value) => {
                      formValues.value.ollamaUrl = value;
                    }}
                  />
                </NFormItem>

                <NFormItem label="选择模型" path="model">
                  <NSelect
                    value={formValues.value.model || void 0}
                    options={models.value}
                    loading={isFetchingModel.value}
                    filterable
                    clearable
                    renderLabel={(option: SelectOption) => (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <NIcon>
                          <EditOutlined />
                        </NIcon>
                        {option.label}
                      </div>
                    )}
                    onUpdate:value={(value) => {
                      formValues.value.model = value;
                    }}
                  >
                  </NSelect>
                </NFormItem>
                <NDivider />
                <div class="prompt-template-config">
                  <NFormItem label="系统提示词模板" path="prompt">
                    <NInput
                      type="textarea"
                      value={formValues.value.prompt || void 0}
                      placeholder="输入提示词模板，使用 {{变量名}} 作为变量占位符"
                      rows={6}
                      onUpdateValue={v => formValues.value!.prompt = v}
                    />
                  </NFormItem>
                  <NButton
                    type="primary"
                    size="small"
                    onClick={() => {
                      previewResult.value = processPromptTemplate(
                        formValues.value!.prompt!,
                        variableValues.value,
                      );
                    }}
                  >
                    预览
                  </NButton>
                  <NCard
                    title="结果预览"
                    size="small"
                    style={{ marginTop: '16px' }}
                  >
                    <div style={{ whiteSpace: 'pre-wrap', margin: 0 }} innerHTML={renderMarkdown(previewResult.value)}></div>
                  </NCard>
                </div>
              </NForm>
            </NSpace>
          </div>
        </NTabPane>
        <NTabPane
          name={ModelType.VISION}
          tab={(
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <NIcon><EyeOutlined /></NIcon>
              {MODEL_TYPE_LABELS[ModelType.VISION]}
            </div>
          )}
        >
          <div class="lc-llm-chat-header__settings">
            <NSpace vertical>
              <NButton onClick={handleServiceProviderAdd}>添加提供商</NButton>
              <NForm
                class="lc-llm-chat-header__settings-form"
                ref={formRef}
                rules={settingRules}
                model={formValues.value}
              >
                <NFormItem label="Ollama URL" path="ollamaUrl">
                  <NInput
                    value={formValues.value.ollamaUrl || void 0}
                    placeholder="输入 Ollama URL"
                    onUpdate:value={(value) => {
                      formValues.value.ollamaUrl = value;
                    }}
                  />
                </NFormItem>

                <NFormItem label="选择模型" path="model">
                  <NSelect
                    value={formValues.value.model || void 0}
                    options={models.value}
                    loading={isFetchingModel.value}
                    filterable
                    clearable
                    renderLabel={(option: SelectOption) => (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <NIcon>
                          <EyeOutlined />
                        </NIcon>
                        {option.label}
                      </div>
                    )}
                    onUpdate:value={(value) => {
                      formValues.value.model = value;
                    }}
                  >
                  </NSelect>
                </NFormItem>

                <NFormItem label="启用视觉能力" path="visionEnabled">
                  <NSwitch
                    value={!!formValues.value.visionEnabled}
                    onUpdateValue={value => formValues.value.visionEnabled = value}
                  />
                </NFormItem>

                <NDivider />

                <NDivider />
                <div class="prompt-template-config">

                  <NFormItem label="系统提示词模板" path="prompt">
                    <NInput
                      type="textarea"
                      value={formValues.value?.prompt || void 0}
                      placeholder="输入提示词模板，使用 {{变量名}} 作为变量占位符"
                      rows={6}
                      onUpdateValue={v => formValues.value!.prompt = v}
                    />
                  </NFormItem>
                  <NButton
                    type="primary"
                    size="small"
                    onClick={() => {
                      previewResult.value = processPromptTemplate(
                        formValues.value!.prompt!,
                        variableValues.value,
                      );
                    }}
                  >
                    预览
                  </NButton>
                  <NCard
                    title="结果预览"
                    size="small"
                    style={{ marginTop: '16px' }}
                  >
                    <div style={{ whiteSpace: 'pre-wrap', margin: 0 }} innerHTML={renderMarkdown(previewResult.value)}></div>
                  </NCard>
                </div>
              </NForm>
            </NSpace>
          </div>
        </NTabPane>
      </NTabs>
    );

    // 打开设置模态框
    const handleSetting = () => {
      modal.create({
        preset: 'dialog',
        title: '模型配置',
        style: {
          width: '800px',
        },
        content: renderSettings,
        onPositiveClick: async () => {
          // 保存当前配置
          const success = await saveCurrentModelConfig();
          if (success) {
            // 更新 Ollama URL
            if (formValues.value.ollamaUrl) {
              setOllamaURL(formValues.value.ollamaUrl);
            }
            emit('save', multiModelConfig.value);
            return true;
          }
          return false;
        },
        positiveText: '保存',
        negativeText: '取消',
      });
    };

    return () => (
      <NButton
        size="small"
        quaternary
        onClick={handleSetting}
        v-slots={{
          icon: () => (
            <NIcon>
              <SettingOutlined />
            </NIcon>
          ),
        }}
      />
    );
  },
});
