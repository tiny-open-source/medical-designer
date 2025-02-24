import { NSelect } from 'naive-ui';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Preview',

  props: {
    modelValue: {
      type: String,
      default: '',
    },
  },
  emit: ['update:modelValue'],
  setup(props, { emit }) {
    const options = [
      {
        label: '横屏1024 * 600',
        value: '1024 * 600',
      },
      {
        label: '横屏1280 * 800',
        value: '1280 * 800',
      },
      {
        label: '横屏1920 * 1080',
        value: '1920 * 1080',
      },
      {
        label: '竖屏600 * 1024',
        value: '600 * 1024',
      },
      {
        label: '竖屏800 * 1280',
        value: '800 * 1280',
      },
      {
        label: '竖屏1080 * 1920',
        value: '1080 * 1920',
      },
    ];
    return () => (
      <NSelect
        value={props.modelValue}
        onUpdateValue={(value) => {
          emit('update:modelValue', value);
        }}
        class="select"
        size="small"
        placeholder="选择分辨率"
        filterable
        options={options}
      />
    );
  },
});
