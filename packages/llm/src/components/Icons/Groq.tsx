import { defineComponent, h } from 'vue';

export const GroqIcon = defineComponent({
  name: 'GroqIcon',
  props: {
    // 允许传递所有SVG属性
    ...({} as any),
  },
  setup(props) {
    return () => h(
      'svg',
      {
        xmlns: 'http://www.w3.org/2000/svg',
        fill: 'currentColor',
        fillRule: 'evenodd',
        viewBox: '0 0 24 24',
        ...props,
      },
      [
        h('path', {
          d: 'M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 3.75a6.25 6.25 0 100 12.5 6.25 6.25 0 000-12.5zM12 7a5 5 0 110 10 5 5 0 010-10z',
          fill: 'currentColor',
        }),
      ],
    );
  },
});

export default GroqIcon;
