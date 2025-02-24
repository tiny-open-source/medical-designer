<script lang="tsx">
import type { DialogReactive } from 'naive-ui';
import type { PropType } from 'vue';
import type Form from './Form.vue';
import type { FormConfig } from './schema';
import { NButton, useDialog } from 'naive-ui';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'l-form-dialog',
  props: {
    values: {
      type: Object,
      default: () => ({}),
    },

    width: [Number, String],

    fullscreen: Boolean,

    title: String,

    config: {
      type: Array as PropType<FormConfig>,
      required: true,
      default: () => [],
    },

    labelWidth: [Number, String],

    size: String as PropType<'small' | 'default' | 'large'>,

    confirmText: {
      type: String,
      default: '确定',
    },
  },
  emits: ['change', 'submit', 'error'],
  setup(props, { emit }) {
    const stepActive = ref(1);
    const form = ref<InstanceType<typeof Form>>();
    const dialog = useDialog();
    const changeHandler = (value: any) => {
      emit('change', value);
    };
    const bodyHeight = ref(`${document.body.clientHeight - 194}px`);
    const save = async () => {
      try {
        const values = await form.value?.submitForm();
        emit('submit', values);
      }
      catch (e) {
        emit('error', e);
      }
    };
    let dialogInstance: DialogReactive;

    function create() {
      dialogInstance = dialog.create({
        type: 'default',
        class: 'l-form-dialog',
        title: props.title,
        content: () => {
          return (
            <div style={`max-height: ${bodyHeight.value}; overflow-y: auto; overflow-x: hidden;`}>
              <l-form
                v-model={stepActive}
                ref={form}
                size={props.size}
                config={props.config}
                init-values={props.values}
                label-width={props.labelWidth}
                onChange={changeHandler}
              />
            </div>
          );
        },
        action: () => (
          <div>
            <NButton type="primary" size="small" onClick={save}>
              {
                props.confirmText
              }
            </NButton>
          </div>
        ),
      });
    }
    function cancel() {
      dialogInstance?.destroy();
    }

    return {
      create,
      cancel,
    };
  },
  render() {
    return null;
  },
});
</script>
