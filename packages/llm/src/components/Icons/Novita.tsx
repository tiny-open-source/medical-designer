import { defineComponent, h } from 'vue';

export const NovitaIcon = defineComponent({
  name: 'NovitaIcon',
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
          d: 'M5.387 12.107l3.83-6.917a.75.75 0 0 1 1.32.014l3.618 6.916c.82 1.316-.38 3.192-2.3 3.044l-4.083-.064c-1.955-.03-3.211-1.97-2.385-2.992ZM19.2 11.535l-3.33-5.796a.748.748 0 0 0-1.308.011l-1.848 3.272-.003.006a.752.752 0 0 0 .012.747l2.895 4.945.003.005a.75.75 0 0 0 .64.358h2.94a.75.75 0 0 0 .647-1.132l-.66-1.147a.748.748 0 0 1 .002-.769Z',
        }),
      ],
    );
  },
});

export default NovitaIcon;
