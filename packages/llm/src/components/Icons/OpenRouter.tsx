import { defineComponent, h } from 'vue';

export const OpenRouterIcon = defineComponent({
  name: 'OpenRouterIcon',
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
          d: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Zm0-5.75a4.253 4.253 0 0 1-4.25-4.25H5.75c0 3.452 2.798 6.25 6.25 6.25s6.25-2.798 6.25-6.25h-2c0 2.35-1.9 4.25-4.25 4.25Zm0-8.5a4.253 4.253 0 0 1 4.25 4.25h2c0-3.452-2.798-6.25-6.25-6.25S5.75 8.548 5.75 12h2c0-2.35 1.9-4.25 4.25-4.25Z',
        }),
      ],
    );
  },
});

export default OpenRouterIcon;
