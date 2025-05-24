import { defineComponent, h } from 'vue';

export const CSVIcon = defineComponent({
  name: 'CSVIcon',
  props: {
    // 允许传递所有SVG属性
    ...({} as any),
  },
  setup(props) {
    return () => h(
      'svg',
      {
        xmlns: 'http://www.w3.org/2000/svg',
        viewBox: '0 0 24 24',
        fill: 'currentColor',
        ...props,
      },
      [
        h('path', {
          d: 'M19.5,3.5L18,2l-1.5,1.5L15,2l-1.5,1.5L12,2l-1.5,1.5L9,2L7.5,3.5L6,2V22l1.5-1.5L9,22l1.5-1.5L12,22l1.5-1.5L15,22l1.5-1.5L18,22l1.5-1.5L21,22V2L19.5,3.5z M19,19.09H5V4.91h14V19.09z M6,15h12v-2H6V15z M6,11h12V9H6V11z M6,7h12V5H6V7z',
        }),
      ],
    );
  },
});

export default CSVIcon;
