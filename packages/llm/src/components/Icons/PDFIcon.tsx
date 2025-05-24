import { defineComponent, h } from 'vue';

export const PDFIcon = defineComponent({
  name: 'PDFIcon',
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
          d: 'M20,2H8C6.9,2,6,2.9,6,4v12c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V4C22,2.9,21.1,2,20,2z M20,16H8V4h12V16z M4,6H2v14c0,1.1,0.9,2,2,2h14v-2H4V6z M16,12V9c0-0.55-0.45-1-1-1h-2V7h3V5h-4v6H16z M14,11h-1v-1h1V11z M9.5,12l1,0l0.5-0.5V9l-0.5-0.5h-2v4H9.5z M9.5,9.5h0.5v2H9.5V9.5z',
        }),
      ],
    );
  },
});

export default PDFIcon;
