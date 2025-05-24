import { defineComponent, h } from 'vue';

export const TogtherIcon = defineComponent({
  name: 'TogtherIcon',
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
          d: 'M2.006 7.553v-.857a.69.69 0 0 1 .661-.714h18.656c.366 0 .663.32.663.714v.857c0 .393-.297.714-.663.714H2.667a.69.69 0 0 1-.661-.714Zm0 9.75v-.857a.69.69 0 0 1 .661-.714h18.656c.366 0 .663.32.663.714v.857c0 .394-.297.714-.663.714H2.667a.69.69 0 0 1-.661-.714Zm0-4.875v-.857a.69.69 0 0 1 .661-.714h18.656c.366 0 .663.32.663.714v.857c0 .394-.297.714-.663.714H2.667a.69.69 0 0 1-.661-.714Z',
        }),
      ],
    );
  },
});

export default TogtherIcon;
