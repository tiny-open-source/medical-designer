import { useDialog } from 'naive-ui';
import { defineComponent } from 'vue';
import DeviceGroup from './DeviceGroup';

export default defineComponent({
  name: 'Preview',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    src: {
      type: String,
      default: '',
    },
  },
  emit: ['update:show'],
  setup(props, { emit }) {
    const dialog = useDialog();
    const stageRectStr = ref('1024 * 600');
    const stageRect = computed(() => {
      const [width, height] = stageRectStr.value.split('*').map(Number);
      return { width, height };
    });
    const ifm = ref<HTMLIFrameElement>();
    watch(stageRect, () => {
      ifm.value?.contentWindow?.location.reload();
    });
    watch(() => props.show, (value) => {
      if (value) {
        dialog.info({
          title: () => (
            <div style="display: flex; justify-content: space-between; align-items: center;width: 100%;">
              <DeviceGroup v-model={stageRectStr.value} />
            </div>
          ),
          style: { width: 'auto' },
          content: () => (
            <div style={{ width: `${stageRect.value.width}px`, height: `${stageRect.value.height}px` }}>
              <iframe
                ref={ifm}
                style="width: 100%; height: 100%; border: none;"
                src={props.src}
              />
            </div>

          ),
          onAfterLeave: () => {
            emit('update:show', false);
          },
        });
      }
    });
    return () => (
      null
    );
  },
});
