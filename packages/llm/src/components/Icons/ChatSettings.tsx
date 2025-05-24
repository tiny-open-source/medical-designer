import { defineComponent, h } from 'vue';

export const ChatSettingsIcon = defineComponent({
  name: 'ChatSettingsIcon',
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
          d: 'M15.586 17.586a2 2 0 1 1 2.828 2.828 2 2 0 0 1-2.828-2.828ZM5.586 7.586a2 2 0 1 1 2.828 2.828 2 2 0 0 1-2.828-2.828ZM4.5 13a2.5 2.5 0 0 1 0-5h7a2.5 2.5 0 0 1 0 5h-7ZM15.5 8a2.5 2.5 0 1 1 0 5h-7a2.5 2.5 0 1 1 0-5h7Z',
        }),
      ],
    );
  },
});

export default ChatSettingsIcon;
