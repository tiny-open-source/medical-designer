import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';

export default defineComponent({
  name: 'StatusIndicator',
  props: {
    status: {
      type: String as PropType<'pending' | 'success' | 'error'>,
      required: true,
    },
  },
  setup(props) {
    const statusConfig = computed(() => {
      switch (props.status) {
        case 'pending':
          return {
            dotClass: 'lc-llm-status-indicator__dot--pending',
            text: '正在搜索您的Ollama 🦙',
          };
        case 'success':
          return {
            dotClass: 'lc-llm-status-indicator__dot--success',
            text: 'Ollama正在运行 🦙',
          };
        case 'error':
        default:
          return {
            dotClass: 'lc-llm-status-indicator__dot--error',
            text: '无法连接到Ollama 🦙',
          };
      }
    });

    return () => (
      <div class="lc-llm-status-indicator">
        <div class="lc-llm-status-indicator__container">
          <div class={['lc-llm-status-indicator__dot', statusConfig.value.dotClass]}></div>
          <p class="lc-llm-status-indicator__text">
            {statusConfig.value.text}
          </p>
        </div>
      </div>
    );
  },
});
