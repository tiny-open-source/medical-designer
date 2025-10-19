import { NSpin } from 'naive-ui';
import { defineComponent, ref } from 'vue';
import { getToolCallStatusText, getToolDisplayConfig } from '../../utils/tool-display-config';

export default defineComponent({
  name: 'ToolCallIndicator',
  props: {
    status: {
      type: String as () => 'executing' | 'completed' | 'failed',
      required: true,
    },
    toolName: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    round: {
      type: Number,
      default: 1,
    },
    toolCount: {
      type: Number,
      default: 1,
    },
  },
  setup(props) {
    const showDetails = ref(false);

    const toggleDetails = () => {
      showDetails.value = !showDetails.value;
    };

    const getStatusIcon = () => {
      if (props.toolName) {
        const toolConfig = getToolDisplayConfig(props.toolName);
        return toolConfig.icon;
      }

      switch (props.status) {
        case 'executing':
          return '🔧';
        case 'completed':
          return '✅';
        case 'failed':
          return '❌';
        default:
          return '🔧';
      }
    };

    const getSimpleStatusText = () => {
      switch (props.status) {
        case 'executing':
          return '工作中';
        case 'completed':
          return '完成';
        case 'failed':
          return '失败';
        default:
          return '工作中';
      }
    };

    const getSimpleStatusIcon = () => {
      switch (props.status) {
        case 'executing':
          return null; // 使用 loading 图标
        case 'completed':
          return '✅';
        case 'failed':
          return '❌';
        default:
          return null;
      }
    };

    const getStatusText = () => {
      return getToolCallStatusText(props.status, props.toolCount);
    };

    const getStatusClass = () => {
      return `lc-llm-tool-call-indicator--${props.status}`;
    };

    const getToolDisplayName = () => {
      if (props.toolName) {
        const toolConfig = getToolDisplayConfig(props.toolName);
        return toolConfig.name;
      }
      return '';
    };

    const getToolDescription = () => {
      if (props.description) {
        return props.description;
      }
      if (props.toolName) {
        const toolConfig = getToolDisplayConfig(props.toolName);
        return toolConfig.description;
      }
      return '';
    };

    return () => (
      <div class={`lc-llm-tool-call-indicator ${getStatusClass()}`}>
        <div class="lc-llm-tool-call-indicator__content">
          {/* 简洁状态显示 */}
          <div
            class="lc-llm-tool-call-indicator__simple"
            onClick={toggleDetails}
          >
            <div class="lc-llm-tool-call-indicator__simple-content">
              {props.status === 'executing'
                ? (
                    <div class="lc-llm-tool-call-indicator__simple-loading">
                      <NSpin size="small" class="lc-llm-tool-call-indicator__simple-spinner" />
                    </div>
                  )
                : (
                    <span class="lc-llm-tool-call-indicator__simple-icon">
                      {getSimpleStatusIcon()}
                    </span>
                  )}
              <span class="lc-llm-tool-call-indicator__simple-text">
                {getSimpleStatusText()}
              </span>
              <span class="lc-llm-tool-call-indicator__expand-icon">
                {showDetails.value ? '▼' : '▶'}
              </span>
            </div>
          </div>

          {/* 详细信息（展开时显示） */}
          {showDetails.value && (
            <div class="lc-llm-tool-call-indicator__details-expanded">
              <div class="lc-llm-tool-call-indicator__header">
                <span class="lc-llm-tool-call-indicator__icon">
                  {getStatusIcon()}
                </span>
                <span class="lc-llm-tool-call-indicator__text">
                  {getStatusText()}
                  {props.round > 1 && (
                    <span class="lc-llm-tool-call-indicator__round">
                      （第
                      {' '}
                      {props.round}
                      {' '}
                      轮）
                    </span>
                  )}
                </span>
              </div>

              {(getToolDisplayName() || getToolDescription()) && (
                <div class="lc-llm-tool-call-indicator__details">
                  {getToolDisplayName() && (
                    <span class="lc-llm-tool-call-indicator__tool-name">
                      工具：
                      {getToolDisplayName()}
                    </span>
                  )}
                  {getToolDescription() && (
                    <span class="lc-llm-tool-call-indicator__description">
                      {getToolDescription()}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  },
});
