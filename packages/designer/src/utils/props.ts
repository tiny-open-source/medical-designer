import type { FormConfig, FormState } from '@lowcode/form';
import designerService from '../services/designer.service';
import eventsService from '../services/events.service';

/**
 * 统一为组件属性表单加上事件、高级、样式配置
 * @param config 组件属性配置
 * @returns Object
 */
export function fillConfig(config: FormConfig = []): FormConfig {
  return [
    {
      type: 'tab',
      items: [
        {
          title: '属性',
          labelWidth: '80px',
          items: [
          // 组件类型，必须要有
            {
              text: 'type',
              name: 'type',
              type: 'hidden',
            },
            // 组件id，必须要有
            {
              text: 'id',
              name: 'id',
              type: 'display',
            },
            {
              name: 'name',
              text: '组件名称',
            },
            ...config,
          ],
        },
        {
          title: '样式',
          labelWidth: '80px',
          items: [
            {
              name: 'style',
              labelWidth: '100px',
              type: 'style-setter',
              items: [
                {
                  names: [
                    'display',
                    'flexDirection',
                    'justifyContent',
                    'alignItems',
                    'flexWrap',
                    'marginTop',
                    'marginRight',
                    'marginBottom',
                    'marginLeft',
                    'paddingTop',
                    'paddingRight',
                    'paddingBottom',
                    'paddingLeft',
                    'width',
                    'height',
                    'overflow',
                    'fontSize',
                    'lineHeight',
                    'fontWeight',
                    'color',
                    'textAlign',
                    'backgroundColor',
                    'backgroundImage',
                    'backgroundSize',
                    'backgroundPosition',
                    'backgroundRepeat',
                    'position',
                    'zIndex',
                    'top',
                    'right',
                    'bottom',
                    'left',
                    'borderTopLeftRadius',
                    'borderTopRightRadius',
                    'borderBottomRightRadius',
                    'borderBottomLeftRadius',
                    'borderTopWidth',
                    'borderTopStyle',
                    'borderTopColor',
                    'borderRightColor',
                    'borderRightWidth',
                    'borderRightStyle',
                    'borderRightColor',
                    'borderBottomWidth',
                    'borderBottomStyle',
                    'borderBottomColor',
                    'borderLeftStyle',
                    'borderLeftWidth',
                    'borderLeftColor',
                    'borderWidth',
                    'borderStyle',
                    'borderColor',
                  ],
                },
              ],
            },
          ],
        },
        {
          title: '事件',
          items: [
            {
              type: 'table',
              name: 'events',
              items: [
                {
                  name: 'name',
                  label: '事件名',
                  type: 'select',
                  size: 'small',
                  options: (lForm: FormState, { formValue }: any) =>
                    eventsService.getEvent(formValue.type).map(option => ({
                      text: option.label,
                      value: option.value,
                    })),
                },
                {
                  name: 'to',
                  label: '联动组件',
                  size: 'small',
                  type: 'ui-select',
                },
                {
                  name: 'method',
                  label: '动作',
                  size: 'small',
                  type: 'select',
                  options: (lForm: FormState, { model }: any) => {
                    const node = designerService.getNodeById(model.to);
                    if (!node?.type)
                      return [];

                    return eventsService.getMethod(node.type).map(option => ({
                      text: option.label,
                      value: option.value,
                    }));
                  },
                },
              ],
            },
          ],
        },
        {
          title: '高级',
          labelWidth: '80px',
          items: [
            {
              type: 'code-link',
              name: 'created',
              text: 'created',
              formTitle: 'created',
            },
          ],
        },
      ],
    },
  ];
}
