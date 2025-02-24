import { parseReasoning, useMessageOption, useOllamaStatus } from '@lowcode/ai';
import { CodeEditor } from '@lowcode/designer';
import { EnterOutlined, StopOutlined } from '@vicons/antd';
import { NButton, NCollapseTransition, NDrawer, NDrawerContent, NIcon, NScrollbar, NSwitch } from 'naive-ui';
import { defineComponent, ref } from 'vue';

function useDynamicTextareaSize(
  textareaRef: Ref<HTMLTextAreaElement | undefined>,
  textContent: Ref<string | undefined>,
  // optional maximum height after which textarea becomes scrollable
  maxHeight?: number,
): void {
  watch(textContent, () => {
    const currentTextarea = textareaRef.value;
    if (currentTextarea) {
      // Temporarily collapse the textarea to calculate the required height
      currentTextarea.style.height = '0px';
      const contentHeight = currentTextarea.scrollHeight;

      if (maxHeight) {
        // Set max-height and adjust overflow behavior if maxHeight is provided
        currentTextarea.style.maxHeight = `${maxHeight}px`;
        currentTextarea.style.overflowY
          = contentHeight > maxHeight ? 'scroll' : 'hidden';
        currentTextarea.style.height = `${Math.min(
          contentHeight,
          maxHeight,
        )}px`;
      }
      else {
        // Adjust height without max height constraint
        currentTextarea.style.height = `${contentHeight}px`;
      }
    }
  });
}
const ThinkingArea = defineComponent({
  components: {
    NSwitch,
    NCollapseTransition,
  },
  props: {
    content: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const show = ref(false);
    return () => (
      <div>
        <NSwitch v-model:value={show.value} v-slots={{ checked: () => <span>折叠</span>, unchecked: () => <span>思考中...</span> }} />
        <NCollapseTransition show={show.value}>
          {props.content}
        </NCollapseTransition>
      </div>
    );
  },
});

export default defineComponent({
  name: 'Preview',
  components: {
    NDrawer,
    NIcon,
    NDrawerContent,
    ThinkingArea,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    code: {
      type: String,
      default: '',
    },
  },
  emit: ['update:show', 'update:code', 'preview', 'save'],
  setup(props, { emit }) {
    const codeStr = ref('');
    const divRef = ref<HTMLDivElement>();
    const textareaRef = ref<HTMLTextAreaElement>();
    const form = ref<HTMLFormElement>();
    const message = ref('');
    useDynamicTextareaSize(textareaRef, message, 150);

    const textAreaFocus = () => {
      textareaRef.value?.focus();
    };
    onMounted(() => {
      emit('update:code', codeStr.value);
      textAreaFocus();
    });
    const resetFormState = () => {
      message.value = '';
    };
    const { check: checkOllamaStatus, status: ollamaStatus } = useOllamaStatus();
    const prompt = computed(() => {
      return `
      ${props.code}

      以上是一个医护终端H5页面的模板定制系统输出的JSON数据。模板结构为：
      - app (根节点)
        - page (页面节点)
          - container/text/button 等组件节点
      请按照我提出的要求修改 JSON 代码，以便生成正确的页面。
      注意事项：
      1. 直接输出代码，不要包含任何额外的解释性文字。
      2. 请确保代码的正确性，否则可能导致页面无法正常显示。
      `;
    });
    const { onSubmit, messages, streaming, stopStreamingRequest } = useMessageOption({
      prompt,
    });
    // 修改消息监听逻辑
    watch(messages, () => {
      divRef.value?.scrollIntoView({ behavior: 'smooth' });
      const latestMessage = messages.value[messages.value.length - 1];
      if (latestMessage && latestMessage.isBot) {
        parseReasoning(latestMessage.message).forEach((e) => {
          if (e.type !== 'reasoning') {
            codeStr.value = e.content;
            emit('update:code', e.content);
          }
        });
      }
    });

    watchEffect(() => {
      props.show && checkOllamaStatus();
      props.show && textAreaFocus();
    });
    const sendMessage = async ({ message }: { message: string }) => {
      onSubmit({
        message,
      });
    };
    const handleKeyDown = async (e: KeyboardEvent) => {
      if (e.key === 'Process' || e.key === '229')
        return;
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const message = (e.target as HTMLTextAreaElement).value;
        if (!message || message.trim().length === 0) {
          return;
        }

        resetFormState();
        textAreaFocus();
        await sendMessage({
          message: message.trim(),
        });
      }
    };
    return () => {
      return (
        <NDrawer
          show={props.show}
          onUpdateShow={(show) => {
            emit('update:show', show);
          }}
          width="60vw"
          placement="right"
        >
          <NDrawerContent
            closable
            title="使用AI优化"
            v-slots={{
              header: () =>
                ollamaStatus.value === 'pending'
                  ? (
                      <div class="flex justify-between items-center px-4 text-nowrap">
                        <div class="text-sm flex items-center gap-2">
                          <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <p class="dark:text-gray-400 text-gray-900">
                            正在搜索您的Ollama 🦙
                          </p>
                        </div>
                      </div>
                    )
                  : ollamaStatus.value === 'success'
                    ? (
                        <div class="flex justify-between items-center px-4 text-nowrap">
                          <div class="text-sm flex items-center gap-2">
                            <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                            <p class="dark:text-gray-400 text-gray-900">
                              Ollama正在运行 🦙
                            </p>
                          </div>
                        </div>
                      )
                    : (
                        <div class="flex justify-between items-center px-4 text-nowrap">
                          <div class="text-sm flex items-center gap-2">
                            <div class="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                            <p class="dark:text-gray-400 text-gray-900">
                              无法连接到Ollama 🦙
                            </p>
                          </div>
                        </div>
                      ),
            }}
          >
            <div class="h-full flex flex-col relative">
              <div class="code-block relative w-full">
                <CodeEditor
                  style="height: 50vh; width: 100%;"
                  type="diff"
                  init-values={props.code}
                  modified-values={codeStr.value}
                  language="json"
                />
                <div class="absolute bottom--10 right-10 flex gap-2 z-10">
                  <NButton type="primary" onClick={() => emit('preview')}>预览</NButton>
                  <NButton type="primary" onClick={() => emit('save')}>保存</NButton>
                </div>
              </div>
              <NScrollbar class="h-full w-full flex-1 relative">
                {messages.value.map(message => (
                  <div class="relative flex w-full flex-col items-center pt-4 pb-4">
                    <div class="group relative flex w-full max-w-3xl flex-col items-end justify-center pb-2 md:px-4 lg:w-4/5 text-gray-800 dark:text-gray-100 }">
                      <div class="flex w-full flex-col gap-2 ">
                        <span class="text-xs font-bold text-gray-800 dark:text-white">
                          {message.isBot ? message.name : 'You'}
                        </span>
                        <div></div>
                        <div class="flex flex-grow flex-col">
                          {message.isBot
                            ? parseReasoning(message.message).map((e, i) => {
                                if (e.type === 'reasoning') {
                                  return (
                                    <ThinkingArea content={e.content} key={i} />
                                  );
                                }
                                return <p></p>;
                              })
                            : (
                                <p
                                  class={`prose dark:prose-invert whitespace-pre-line prose-p:leading-relaxed prose-pre:p-0 dark:prose-dark ${
                                    message.messageType
                                    && 'italic text-gray-500 dark:text-gray-400 text-sm'}`}
                                >
                                  {message.message}
                                </p>
                              )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={divRef} />

                <div class="w-full pb-[220px]"></div>
              </NScrollbar>

              <div class="absolute bottom-0 w-full">
                <div class="flex w-full flex-col items-center p-2 pt-1  pb-4">
                  <div class="relative z-10 flex w-full flex-col items-center justify-center gap-2 text-base">
                    <div class="relative flex w-full flex-row justify-center gap-2 lg:w-4/5">
                      <div class="bg-neutral-50  relative w-full max-w-[48rem] p-1 backdrop-blur-lg duration-100 border border-gray-300 border-solid rounded-xl">
                        <div class="flex bg-transparent">
                          <form
                            ref={form}
                            onSubmit={async (e) => {
                              e.preventDefault();
                              const message = textareaRef.value?.value;
                              if (!message || message.trim().length === 0) {
                                return;
                              }

                              resetFormState();
                              textAreaFocus();

                              sendMessage({
                                message: message.trim(),
                              });
                            }}
                            class="shrink-0 flex-grow  flex flex-col items-center "
                          >
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              class="sr-only"
                              accept="image/*"
                            />
                            <div class="w-full  flex flex-col dark:border-gray-600  p-2">
                              <textarea
                                ref={textareaRef}
                                class="px-2 py-2 w-full resize-none bg-transparent focus-within:outline-none focus:ring-0 focus-visible:ring-0 ring-0 dark:ring-0 border-0 dark:text-gray-100"
                                rows="1"
                                tabindex="0"
                                placeholder="提出你的要求"
                                style={{ minHeight: '30px' }}
                                disabled={ollamaStatus.value !== 'success'}
                                onKeydown={e => handleKeyDown(e)}
                                v-model={message.value}
                              />

                              <div class="mt-2 flex justify-between items-center">
                                <div></div>
                                <div class="flex !justify-end gap-3">
                                  <div class="ant-space-compact css-dev-only-do-not-override-xjks6i ant-space-compact-block ant-dropdown-button !justify-end !w-auto">
                                    {!streaming.value
                                      ? (
                                          <NButton
                                            attr-type="submit"
                                            size="small"
                                            type="primary"
                                            disabled={ollamaStatus.value !== 'success'}
                                            v-slots={{
                                              icon: () => (
                                                <NIcon size="small">
                                                  <EnterOutlined />
                                                </NIcon>
                                              ),
                                            }}
                                          >
                                            {
                                              ollamaStatus.value === 'success'
                                                ? '提交'
                                                : '未连接'
                                            }
                                          </NButton>
                                        )
                                      : (
                                          <NButton
                                            size="small"
                                            type="primary"
                                            onClick={stopStreamingRequest}
                                            v-slots={{
                                              icon: () => (
                                                <NIcon size="small">
                                                  <StopOutlined />
                                                </NIcon>
                                              ),
                                            }}
                                          >
                                          </NButton>
                                        ) }
                                  </div>
                                </div>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <p class="w-full text-center text-12px text-coolgray select-none">注：大模型采用蒸馏版 deepseek-r1:14b, 一次性传输过量 Token 可能会导致无法得出准确的回答，仅供测试。</p>
              </div>
            </div>
          </NDrawerContent>
        </NDrawer>
      );
    };
  },
});
