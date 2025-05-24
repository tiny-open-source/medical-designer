import { defineComponent, h } from 'vue';

export const OllamaIcon = defineComponent({
  name: 'OllamaIcon',
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
          d: 'M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10Zm-2.5-6.5c.413 0 .75-.337.75-.75V9.5a.749.749 0 1 0-1.5 0v5.25c0 .413.337.75.75.75Zm5 0c.413 0 .75-.337.75-.75V9.5a.749.749 0 1 0-1.5 0v5.25c0 .413.337.75.75.75Z',
        }),
      ],
    );
  },
});

export default OllamaIcon;
