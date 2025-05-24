import { defineComponent, h } from 'vue';

export const LMStudioIcon = defineComponent({
  name: 'LMStudioIcon',
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
          d: 'M12.249 2.683a.729.729 0 0 0-.506 0c-2.029.686-7.177 2.786-8.95 6.987a9.003 9.003 0 0 0 .05 6.75c1.635 4.055 6.343 4.928 9.15 4.928 2.808 0 7.515-.873 9.15-4.928a9 9 0 0 0 .052-6.75c-1.774-4.202-6.922-6.301-8.946-6.987Z',
        }),
        h('path', {
          d: 'M6.222 13.796h1.334v-3.612h3.482V8.889H6.222v4.907Zm6.223 0h5.334V8.89h-5.334v1.295h3.965v.827h-3.965v1.487h3.965v1.298h-3.965Z',
          fill: 'white',
        }),
      ],
    );
  },
});

export default LMStudioIcon;
