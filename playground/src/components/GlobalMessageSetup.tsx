import { useMessage } from 'naive-ui';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'GlobalMessageSetup',
  setup() {
    (window as any).$message = useMessage();
    return <div></div>;
  },
});
