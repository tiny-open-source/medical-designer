import { NCollapseTransition, NSwitch } from 'naive-ui';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'ThinkingArea',
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
    const show = ref(true);
    return () => (
      <div class="lc-llm-thinking-area">
        <div class="lc-llm-thinking-area__header">
          <h3 class="lc-llm-thinking-area__header-title">AI思考过程</h3>
          <NSwitch
            v-model:value={show.value}
            v-slots={{
              checked: () => <span class="lc-llm-thinking-area__header-switch-text">展开</span>,
              unchecked: () => <span class="lc-llm-thinking-area__header-switch-text">折叠</span>,
            }}
          />
        </div>
        <NCollapseTransition show={show.value}>
          <div class="lc-llm-thinking-area__content">
            {props.content}
          </div>
        </NCollapseTransition>
      </div>
    );
  },
});
