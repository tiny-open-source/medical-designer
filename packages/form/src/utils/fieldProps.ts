import type { PropType } from 'vue';

export default {
  model: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  name: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  size: String as PropType<'tiny' | 'small' | 'medium' | 'large'>,
  prop: String,
  initValues: Object,
  values: Object,
};
