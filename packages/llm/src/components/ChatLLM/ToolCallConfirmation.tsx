import type { PropType } from 'vue';
import { defineComponent } from 'vue';

export interface ToolCallConfirmationProps {
  currentRound: number;
  maxRound: number;
  onContinue: () => void;
  onCancel: () => void;
}

export default defineComponent({
  name: 'ToolCallConfirmation',
  props: {
    currentRound: {
      type: Number,
      required: true,
    },
    maxRound: {
      type: Number,
      required: true,
    },
    onContinue: {
      type: Function as PropType<() => void>,
      required: true,
    },
    onCancel: {
      type: Function as PropType<() => void>,
      required: true,
    },
  },
  setup(props) {
    const handleContinue = () => {
      props.onContinue();
    };

    const handleCancel = () => {
      props.onCancel();
    };

    return () => (
      <div class="lc-llm-tool-call-confirmation">
        <div class="lc-llm-tool-call-confirmation__content">
          <div class="lc-llm-tool-call-confirmation__icon">
            ⏱️
          </div>
          <div class="lc-llm-tool-call-confirmation__message">
            <p class="lc-llm-tool-call-confirmation__title">
              AI助手已经运行了一段时间，是否继续？
            </p>
            <p class="lc-llm-tool-call-confirmation__details">
              已完成
              {' '}
              {props.currentRound}
              {' '}
              轮工具调用（上限:
              {' '}
              {props.maxRound}
              {' '}
              轮）
            </p>
          </div>
        </div>
        <div class="lc-llm-tool-call-confirmation__actions">
          <button
            class="lc-llm-tool-call-confirmation__button lc-llm-tool-call-confirmation__button--cancel"
            onClick={handleCancel}
          >
            取消
          </button>
          <button
            class="lc-llm-tool-call-confirmation__button lc-llm-tool-call-confirmation__button--continue"
            onClick={handleContinue}
          >
            继续
          </button>
        </div>
      </div>
    );
  },
});
