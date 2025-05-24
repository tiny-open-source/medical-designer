import { defineComponent, h } from 'vue';

export const InfinigenceAIIcon = defineComponent({
  name: 'InfinigenceAIIcon',
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
          d: 'M12 3.5a8.5 8.5 0 0 1 8.5 8.5 8.5 8.5 0 0 1-8.5 8.5 8.5 8.5 0 0 1-8.5-8.5A8.5 8.5 0 0 1 12 3.5zm0 0v17m8.5-8.5h-17',
        }),
      ],
    );
  },
});

export default InfinigenceAIIcon;
