import { defineComponent, h } from 'vue';

export const MistralIcon = defineComponent({
  name: 'MistralIcon',
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
          d: 'M15.25 11.997C15.25 9.101 17.59 6.75 20.5 6.75V4.25C16.219 4.25 12.75 7.719 12.75 12C12.75 16.281 16.219 19.75 20.5 19.75V17.25C17.59 17.25 15.25 14.899 15.25 12.003V12V11.997ZM11.25 11.997C11.25 7.581 14.841 4 19.25 4V2C13.728 2 9.25 6.487 9.25 12C9.25 17.513 13.728 22 19.25 22V20C14.841 20 11.25 16.419 11.25 12.003V12V11.997ZM7.25 11.997C7.25 6.064 12.059 1.25 18 1.25V0.75C11.787 0.75 6.75 5.778 6.75 12C6.75 18.222 11.787 23.25 18 23.25V22.75C12.059 22.75 7.25 17.936 7.25 12.003V12V11.997Z',
        }),
      ],
    );
  },
});

export default MistralIcon;
