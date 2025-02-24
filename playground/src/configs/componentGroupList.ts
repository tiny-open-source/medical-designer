import type { ComponentGroup } from '@lowcode/designer';
import { BorderOuterOutlined, FileImageOutlined, FileTextOutlined, GroupOutlined, PoweroffOutlined, QrcodeOutlined } from '@vicons/antd';
import { markRaw } from 'vue';

export default [
  {
    title: '容器',
    items: [
      {
        icon: markRaw(GroupOutlined),
        text: '普通容器',
        type: 'container',
      },
      {
        icon: markRaw(BorderOuterOutlined),
        text: '蒙层',
        type: 'overlay',
      },
    ],
  },
  {
    title: '组件',
    items: [
      {
        icon: markRaw(FileTextOutlined),
        text: '文本',
        type: 'text',
      },
      {
        icon: markRaw(PoweroffOutlined),
        text: '按钮',
        type: 'button',
      },
      {
        icon: markRaw(FileImageOutlined),
        text: '图片',
        type: 'img',
      },
      {
        icon: markRaw(QrcodeOutlined),
        text: '二维码',
        type: 'qrcode',
      },
    ],
  },
  {
    title: '组合',
    items: [
      {
        icon: markRaw(FileTextOutlined),
        text: '弹窗',
        data: {
          type: 'overlay',
          style: {
            position: 'fixed',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
          },
          name: '弹窗',
          items: [
            {
              type: 'container',
              style: {
                position: 'absolute',
                width: '80%',
                height: '400',
                top: '143.87',
                left: 37.5,
                backgroundColor: 'rgba(255, 255, 255, 1)',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '100% 100%',
              },
              name: '组',
              items: [],
              layout: 'absolute',
            },
          ],
        },
      },
      {
        icon: markRaw(FileTextOutlined),
        text: '护理标签',
        type: 'text',
      },
      {
        icon: markRaw(FileTextOutlined),
        text: '床位列表',
        type: 'text',
      },
    ],
  },
] as ComponentGroup[];
