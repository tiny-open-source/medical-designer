import { NScrollbar } from 'naive-ui';
import { defineComponent } from 'vue';
import { useMessageOption } from '../../composables/chat';
import { useOllamaStatus } from '../../composables/ollama';
import aiAssistantService from '../../service/ai-assistant.service';
import { ModelType } from '../../utils/constants';
import { useMultiModel } from '../../utils/storage';
import Header from './ChatHeader';
import TextAreaForm from './ChatInputArea';
import Messages from './ChatMessages';
import OllamaStatusIndicator from './OllamaStatusIndicator';

export default defineComponent({
  name: 'l-form-llm-chat',
  setup() {
    const divRef = ref<HTMLDivElement>();
    const textAreaFormRef = ref<InstanceType<typeof TextAreaForm>>();

    // Ollama 状态检查
    const { check: checkOllamaStatus, status: ollamaStatus }
      = useOllamaStatus();

    const models = useMultiModel();
    const activeModelType = ref<ModelType>(ModelType.MAIN);
    onMounted(() => {
      (textAreaFormRef.value as any)?.focus();
      checkOllamaStatus();
    });
    const currentModel = computed(() => {
      const model = models.value[activeModelType.value];
      if (!model) {
        throw new Error('模型未定义');
      }
      return model;
    },
    );
    // 消息处理
    const { onSubmit, messages, streaming, stopStreamingRequest, resetState }
      = useMessageOption(
        currentModel,
      );

    // 处理消息更新，增强自动化工作流
    watch(messages, async () => {
      // 滚动到最新消息
      if (divRef.value) {
        divRef.value.scrollIntoView({ behavior: 'smooth' });
      }

      // 解析最新的机器人消息
      const latestMessage = messages.value[messages.value.length - 1];
      if (latestMessage && latestMessage.isBot) {
        if (latestMessage.generationInfo) {
          try {
            console.log('最新消息:', latestMessage);

            const toolResult = await aiAssistantService!.processResponse(latestMessage.message);

            // 如果有工具执行结果，将其添加到新消息中
            if (toolResult) {
              // 延迟很短时间再发送，确保UI状态正确更新
              await new Promise(resolve => setTimeout(resolve, 50));
              await onSubmit({
                message: typeof toolResult === 'string' ? toolResult : JSON.stringify(toolResult),
                image: '',
              });
            }
          }
          catch (error) {
            console.error('工具执行失败:', error);
          }
        }
      }
    }, { deep: true });

    // 处理图片上传和分析
    const processImage = async (message: string, image: string): Promise<string | undefined> => {
      if (!image)
        return;
      // 如果有图片，切换到vision_model
      activeModelType.value = ModelType.VISION;
      try {
        const response = await onSubmit({
          message: `<user_image_query>${message || '开始分析'}</user_image_query>`,
          image,
        });
        console.log('response.message:', response.message);

        return response.message;
      }
      catch (error) {
        console.error('发送消息失败:', error);
        // 可以在这里添加错误提示
      }
    };
    // 发送消息
    const sendMessage = async ({ message, image }: { message: string;image: string }) => {
      if (image) {
        const res = await processImage(message, image);
        if (res) {
          message = res;
          resetState();
        }
      }
      activeModelType.value = ModelType.MAIN;
      try {
        await onSubmit({
          message: `<user_query>${message}</user_query>`,
          image: '',
        });
      }
      catch (error) {
        console.error('发送消息失败:', error);
        // 可以在这里添加错误提示
      }
    };

    // 处理表单提交
    const handleSubmit = async ({ message, image }: { message: string; image: string }) => {
      await sendMessage({
        message,
        image,
      });
    };
    const handleNewChat = () => {
      // 重制状态
      resetState();
      // 重新聚焦输入框
      (textAreaFormRef.value as any)?.focus();
    };
    const handleSettingSaved = () => {
      handleNewChat();
    };
    return () => (
      <div class="lc-llm-chat-form">
        <Header onNewChat={handleNewChat} onSettingSaved={handleSettingSaved} />
        <OllamaStatusIndicator
          style={{ display: messages.value.length > 0 ? 'none' : 'flex' }}
          status={ollamaStatus.value}
        />
        {/* 消息区域 */}
        <NScrollbar class="lc-llm-chat-form__messages-container">
          <div class="lc-llm-chat-form__messages-wrapper">
            <Messages messages={messages.value} />
            <div ref={divRef} />
            <div class="lc-llm-chat-form__spacer"></div>
          </div>
        </NScrollbar>

        {/* 输入区域 */}
        <TextAreaForm
          ref={textAreaFormRef}
          onSubmit={handleSubmit}
          onStop={stopStreamingRequest}
          status={
            !models.value.mainModel?.model
              ? 'disabled'
              : streaming.value
                ? 'pending'
                : 'ready'
          }
        />
      </div>
    );
  },
});
