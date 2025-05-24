import { CodeEditor } from '@low-code/designer';
import { useDialog } from 'naive-ui';
import { defineComponent } from 'vue';
import mockFigmaJson from './FigmaJSON.json?raw';

export default defineComponent({
  name: 'Preview',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  emit: ['update:show'],
  setup(props, { emit }) {
    const codeEditorRef = ref<InstanceType<typeof CodeEditor>>();
    const dialog = useDialog();
    const values = shallowRef(mockFigmaJson as any);

    watch(
      () => props.show,
      (value) => {
        if (value) {
          dialog.create({
            title: '从蓝湖导入FigmaJSON(示例)',
            style: { width: 'auto' },
            content: () => (
              <CodeEditor
                ref={codeEditorRef}
                style="height: 800px; width: 900px;"
                init-values={values.value}
                language="json"
              />
            ),
            onAfterLeave: () => {
              emit('update:show', false);
            },
            positiveText: '解析并导入',
            onPositiveClick: () => {
              emit('save', codeEditorRef.value?.getEditorValue());
            },
          });
        }
      },
    );
    return () => null;
  },
});
