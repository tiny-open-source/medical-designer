import { defineComponent, h } from 'vue';

export const GeminiIcon = defineComponent({
  name: 'GeminiIcon',
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
          d: 'M9.975 19.548V4.45c0-.32.26-.58.582-.58h2.666c.322 0 .582.26.582.58v15.098c0 .32-.26.582-.582.582h-2.666c-.32 0-.582-.26-.582-.582Zm-8.675 0V4.45c0-.32.26-.58.582-.58h2.666c.322 0 .582.26.582.58v15.098c0 .32-.26.582-.582.582H1.882c-.32 0-.582-.26-.582-.582Zm17.35 0V4.45c0-.32.26-.58.582-.58h2.666c.322 0 .582.26.582.58v15.098c0 .32-.26.582-.582.582H19.23c-.32 0-.582-.26-.582-.582Z',
        }),
      ],
    );
  },
});

export default GeminiIcon;
