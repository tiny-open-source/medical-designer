import { defineComponent, h } from 'vue';

export const FireworksIcon = defineComponent({
  name: 'FireworksIcon',
  props: {
    // 允许传递所有SVG属性
    ...({} as any),
  },
  setup(props) {
    return () => h(
      'svg',
      {
        xmlns: 'http://www.w3.org/2000/svg',
        viewBox: '0 0 200 200',
        fill: 'currentColor',
        ...props,
      },
      [
        h('path', {
          d: 'M100 180c-44.09 0-80-35.91-80-80s35.91-80 80-80 80 35.91 80 80-35.91 80-80 80zm0-150c-38.63 0-70 31.37-70 70s31.37 70 70 70 70-31.37 70-70-31.37-70-70-70z',
        }),
        h('path', {
          d: 'M151.65 131.34L142 89.85l-40.42 15.45 50.07 26.04z',
        }),
        h('path', {
          d: 'M99.03 75.19L57.54 65.54l9.65 41.49 31.84-31.84z',
        }),
        h('path', {
          d: 'M77.63 128.98l41.49 9.65-9.65-41.49-31.84 31.84z',
        }),
      ],
    );
  },
});

export default FireworksIcon;
