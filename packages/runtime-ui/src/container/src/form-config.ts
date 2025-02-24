export default [
  {
    name: 'layout',
    text: '容器布局',
    type: 'select',
    defaultValue: 'absolute',
    options: [
      { value: 'absolute', text: '绝对定位' },
      { value: 'relative', text: '流式布局' },
    ],
    onChange: (formState: any, v: string, { model }: any) => {
      if (!model.style)
        return v;
      if (v === 'relative') {
        model.style.height = 'auto';
      }
      else {
        const el = formState.stage?.renderer?.contentWindow.document.getElementById(model.id);
        if (el) {
          model.style.height = el.getBoundingClientRect().height;
        }
      }
    },
  },
];
