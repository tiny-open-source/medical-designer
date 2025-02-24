export default [
  {
    name: 'paramsKey',
    type: 'treeSelect',
    // TODO 支持通过ajax获取选项，以下仅为测试值
    options: [
      {
        text: 'Folder-1',
        value: 'Folder-1-v',
        children: [
          {
            text: 'File-1-1',
            value: 'File-1-1-v',
          },
          {
            text: 'Folder-1-2',
            value: 'Folder-1-2-v',
            children: [
              {
                text: 'File-1-2-1',
                value: 'File-1-2-1-v',
              },
              {
                text: 'File-1-2-2',
                value: 'File-1-2-2-v',
              },
            ],
          },
        ],
      },
      {
        text: 'Folder-2',
        value: 'Folder-2-v',
        children: [
          {
            text: 'File-2-1',
            value: 'File-2-1-v',
          },
          {
            text: 'File-2-2',
            value: 'File-2-2-v',
          },
        ],
      },
    ],
    text: '参数键',
  },
  {
    name: 'text',
    text: '文本',
  },
  {
    name: 'multiple',
    text: '多行文本',
    type: 'switch',
  },
];
