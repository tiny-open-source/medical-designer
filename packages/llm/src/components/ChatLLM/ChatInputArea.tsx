import type { PropType } from 'vue';
import { useDynamicTextareaSize } from '@low-code/llm';
import {
  AudioMutedOutlined,
  AudioOutlined,
  EnterOutlined,
  FileImageOutlined,
  QuestionCircleOutlined,
  StopOutlined,
  CloseCircleOutlined as X,
} from '@vicons/antd';
import { NButton, NCheckbox, NCheckboxGroup, NIcon, NImage, NSpace, NTooltip } from 'naive-ui';
import { defineComponent, reactive, ref, toRef, watch } from 'vue';
import { useSpeechRecognition } from '../../composables/speech-recognition';
import { toBase64 } from '../../libs/to-base64';

// 表单状态管理
function useFormState() {
  const formValue = reactive({
    message: '',
    image: '',
  });

  // 添加连续对话模式状态
  const continuousMode = ref(false);

  const resetFormState = () => {
    formValue.message = '';
    formValue.image = '';
  };

  return {
    formValue,
    continuousMode,
    resetFormState,
  };
}

// 表单提交逻辑
function useFormSubmit(props: any, emit: any, formValue: any, resetFormState: () => void, focus: () => void) {
  const isValidSubmission = () => {
    const message = formValue.message?.trim();
    return message || formValue.image;
  };

  const handleSubmit = async (e: Event) => {
    if (props.status === 'disabled' || props.status === 'pending')
      return;

    e.preventDefault();

    if (!isValidSubmission())
      return;

    emit('submit', {
      message: formValue.message?.trim() || '',
      image: formValue.image,
    });

    resetFormState();
    focus();
  };

  const handleKeyDown = async (e: KeyboardEvent) => {
    if (props.status === 'disabled' || props.status === 'pending')
      return;
    if (e.key === 'Process' || e.key === '229')
      return;

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();

      if (!isValidSubmission())
        return;

      emit('submit', {
        message: formValue.message?.trim() || '',
        image: formValue.image,
      });

      resetFormState();
      focus();
    }
  };

  return {
    handleSubmit,
    handleKeyDown,
  };
}

// 语音识别逻辑
function useSpeechHandler(textareaRef: any, submitForm: () => void, continuousMode: any, props: any) {
  const speechRecognition = useSpeechRecognition({
    autoStop: true,
    autoStopTimeout: 2000,
    // 根据连续模式决定是否自动提交并重启
    onEnd: () => {
      if (continuousMode.value) {
        // 检查是否在等待大模型回复中
        if (props.status === 'pending') {
          // 如果正在回复中，延迟提交直到回复完成
          const waitForResponse = () => {
            if (props.status !== 'pending') {
              submitForm();
              // 重新启动语音识别
              setTimeout(() => {
                if (continuousMode.value && !speechRecognition.isListening.value) {
                  speechRecognition.resetTranscript();
                  speechRecognition.start({
                    continuous: true,
                    lang: 'zh-CN',
                  });
                }
              }, 1000);
            }
            else {
              // 继续等待
              setTimeout(waitForResponse, 500);
            }
          };
          waitForResponse();
        }
        else {
          // 立即提交当前消息
          submitForm();

          // 延迟重新启动语音识别，实现连续对话
          setTimeout(() => {
            if (continuousMode.value && !speechRecognition.isListening.value && props.status !== 'pending') {
              speechRecognition.resetTranscript();
              speechRecognition.start({
                continuous: true,
                lang: 'zh-CN',
              });
            }
          }, 1000); // 增加到1000ms，给大模型响应时间
        }
      }
    },
  });

  const toggleSpeechRecognition = () => {
    if (speechRecognition.isListening.value) {
      speechRecognition.stop();
    }
    else {
      // 检查是否可以启动语音识别
      if (props.status === 'pending') {
        // 如果正在等待回复，先停止连续模式或提示用户等待
        return;
      }

      speechRecognition.resetTranscript();
      speechRecognition.start({
        continuous: true,
        lang: 'zh-CN',
      });
    }
  };

  // 当连续模式关闭时，停止语音识别
  watch(continuousMode, (newValue) => {
    if (!newValue && speechRecognition.isListening.value) {
      speechRecognition.stop();
    }
  });

  // 监听props.status变化，处理回复完成后的重启
  watch(() => props.status, (newStatus, oldStatus) => {
    // 当从pending状态变为ready状态时，如果开启了连续模式，重启语音识别
    if (oldStatus === 'pending' && newStatus === 'ready' && continuousMode.value && !speechRecognition.isListening.value) {
      setTimeout(() => {
        if (continuousMode.value && !speechRecognition.isListening.value) {
          speechRecognition.resetTranscript();
          speechRecognition.start({
            continuous: true,
            lang: 'zh-CN',
          });
        }
      }, 500);
    }
  });

  watch(speechRecognition.transcript, (transcript) => {
    if (speechRecognition.isListening.value) {
      textareaRef.value!.value = transcript;
      textareaRef.value!.dispatchEvent(new Event('input'));
    }
  });

  return {
    ...speechRecognition,
    toggleSpeechRecognition,
  };
}

// 文件上传逻辑
function useFileUpload(formValue: any, inputRef: any) {
  const handleFileChange = async (e: any) => {
    const file = e instanceof File ? e : e.target?.files?.[0];
    if (!file)
      return;

    const base64 = await toBase64(file);
    formValue.image = base64;
  };

  const clearImage = () => {
    formValue.image = '';
    if (inputRef.value) {
      inputRef.value.value = '';
    }
  };

  return {
    handleFileChange,
    clearImage,
  };
}

export default defineComponent({
  name: 'TextAreaForm',
  props: {
    status: String as PropType<'ready' | 'pending' | 'disabled'>,
  },
  emits: ['submit', 'stop'],
  setup(props, { emit, expose }) {
    // Refs
    const form = ref<HTMLFormElement>();
    const textareaRef = ref<HTMLTextAreaElement>();
    const inputRef = ref<HTMLInputElement>();

    // 组合式函数
    const { formValue, continuousMode, resetFormState } = useFormState();

    const focus = () => textareaRef.value?.focus();
    const submitForm = () => form.value?.dispatchEvent(new Event('submit'));

    const { handleSubmit, handleKeyDown } = useFormSubmit(
      props,
      emit,
      formValue,
      resetFormState,
      focus,
    );

    const speechHandler = useSpeechHandler(textareaRef, submitForm, continuousMode, props);
    const { handleFileChange, clearImage } = useFileUpload(formValue, inputRef);

    // 动态调整文本框大小
    useDynamicTextareaSize(textareaRef, toRef(formValue, 'message'), 150);

    // 暴露方法
    expose({ focus });

    // 渲染函数
    const renderImagePreview = () => (
      <div class={`lc-llm-input-area__header-wrapper ${formValue.image === '' ? 'hidden' : ''}`}>
        <div class="lc-llm-input-area__header-image">
          <button
            type="button"
            onClick={clearImage}
            class="lc-llm-input-area__header-image-button"
          >
            <X class="lc-llm-input-area__header-image-close-button" />
          </button>
          <NImage
            src={formValue.image}
            alt="Uploaded Image"
            previewDisabled
            class="lc-llm-input-area__header"
          />
        </div>
        <div class="lc-llm-input-area__header-ref-image-info">
          <div class="lc-llm-input-area__header-ref-image-info-title">
            <span>选择要参考的内容:</span>
          </div>
          <div class="lc-llm-input-area__header-ref-image-info-content">
            <NCheckboxGroup size="small">
              <NSpace item-style="display: flex;">
                <NCheckbox value="1" label="布局结构" />
                <NCheckbox value="2" label="颜色样式" />
                <NCheckbox value="3" label="文案内容" />
              </NSpace>
            </NCheckboxGroup>
          </div>
        </div>
      </div>
    );

    const renderControlButtons = () => (
      <div class="lc-llm-input-area__button-group">
        {speechHandler.supported.value && (
          <div class="lc-llm-input-area__speech-controls">
            <NTooltip
              trigger="hover"
              v-slots={{
                trigger: () => (
                  <NButton
                    size="small"
                    type="tertiary"
                    disabled={props.status === 'disabled'}
                    onClick={speechHandler.toggleSpeechRecognition}
                    class={speechHandler.isListening.value ? 'lc-llm-speech-active' : ''}
                    v-slots={{
                      icon: () => speechHandler.isListening.value
                        ? <NIcon size="small" color="#f56c6c" style="opacity: 0.8;"><AudioMutedOutlined /></NIcon>
                        : <NIcon size="small"><AudioOutlined /></NIcon>,
                    }}
                  />
                ),
              }}
            >
              {speechHandler.isListening.value
                ? '点击停止录音'
                : props.status === 'pending'
                  ? '等待回复中...'
                  : '语音转文本'}
            </NTooltip>

            <NTooltip
              trigger="hover"
              v-slots={{
                trigger: () => (
                  <NCheckbox
                    size="small"
                    v-model:checked={continuousMode.value}
                    disabled={props.status === 'disabled'}
                    style="margin-left: 8px; font-size: 12px;"
                  >
                    连续对话
                  </NCheckbox>
                ),
              }}
            >
              开启后语音识别完成会自动发送消息，大模型回复完成后自动继续监听
            </NTooltip>
          </div>
        )}

        <NTooltip
          trigger="hover"
          v-slots={{
            trigger: () => (
              <NButton
                size="small"
                type="tertiary"
                disabled={props.status === 'disabled'}
                onClick={() => inputRef.value?.click()}
                v-slots={{
                  icon: () => <NIcon size="small"><FileImageOutlined /></NIcon>,
                }}
              />
            ),
          }}
        >
          上传图片
        </NTooltip>

        {props.status !== 'pending'
          ? (
              <NButton
                attr-type="submit"
                size="small"
                type="primary"
                disabled={props.status === 'disabled'}
                v-slots={{
                  icon: () => <NIcon size="small"><EnterOutlined /></NIcon>,
                }}
              >
                {props.status !== 'disabled' ? '提交' : '未连接'}
              </NButton>
            )
          : (
              <NButton
                size="small"
                type="warning"
                onClick={() => emit('stop')}
                v-slots={{
                  icon: () => <NIcon size="small"><StopOutlined /></NIcon>,
                }}
              >
                停止
              </NButton>
            )}
      </div>
    );
    const getExamplePrompt = () => {
      const examples = [
        '画一面国旗',
        '制作一张海报',
        '设计一个登录界面',
        '生成一个产品介绍页面',
        '加入一个二维码',
        '添加一个按钮',
        '把xx元素放大一点',
        '把xx元素缩小一点',
        '把xx元素移动到左边',
        '把xx元素移动到右边',
        '把xx元素移动到上面',
        '把xx元素移动到下面',
        '把xx元素居中对齐',
        '把xx元素对齐到左边',
        '把xx元素对齐到右边',
        '把xx元素放到xx容器里面',
        '把xx元素放到xx容器外面',
        '把xx元素放到xx容器的左边',
        '把xx元素放到xx容器的右边',
        '把xx元素放到xx容器的上面',
        '把xx元素放到xx容器的下面',
        '把xx元素放到xx容器的中间',
        '给xx元素添加一些阴影',
        '给画布一个蓝色背景',
      ];
      return examples[Math.floor(Math.random() * examples.length)];
    };
    const renderTextarea = () => (
      <div class="lc-llm-input-area__input-container">
        <textarea
          autofocus
          ref={textareaRef}
          class="lc-llm-input-area__textarea"
          rows="1"
          tabindex="0"
          placeholder={`描述你想让ai做什么，例如：${getExamplePrompt()}\n支持上传截图作为参考`}
          style={{ minHeight: '68px' }}
          onKeydown={handleKeyDown}
          v-model={formValue.message}
        />

        <div class="lc-llm-input-area__controls">
          <NTooltip>
            {{
              trigger: () => (
                <NButton text size="small">
                  <NIcon size="small"><QuestionCircleOutlined /></NIcon>
                </NButton>
              ),
              default: () => (
                <div>
                  <p>使用提示：</p>
                  <p>- 按Enter发送消息</p>
                  <p>- Shift+Enter换行</p>
                  {speechHandler.supported.value && (
                    <>
                      <p>- 点击麦克风开始语音输入</p>
                      <p>- 开启连续对话可自动发送语音消息</p>
                    </>
                  )}
                </div>
              ),
            }}
          </NTooltip>

          {renderControlButtons()}
        </div>
      </div>
    );

    return () => (
      <div class="lc-llm-input-area">
        <div class="lc-llm-input-area__container">
          {renderImagePreview()}

          <div class="lc-llm-input-area__wrapper">
            <div class="lc-llm-input-area__form-container">
              <div class="lc-llm-input-area__form-wrapper">
                <div class="lc-llm-input-area__form">
                  <form
                    ref={form}
                    onSubmit={handleSubmit}
                    class="shrink-0 flex-grow flex flex-col items-center"
                  >
                    <input
                      id="file-upload"
                      name="file-upload"
                      ref={inputRef}
                      type="file"
                      class="hidden"
                      accept="image/*"
                      multiple={false}
                      onChange={handleFileChange}
                    />
                    {renderTextarea()}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
});
