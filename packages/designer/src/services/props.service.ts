import type { FormConfig } from '@low-code/form';
import type { MComponent, MNode } from '@low-code/schema';
import type { PropsState } from '../type';
import { toLine } from '@low-code/utils';
import { cloneDeep, mergeWith } from 'lodash-es';
import { reactive } from 'vue';
import { fillConfig } from '../utils/props';
import BaseService from './base.service';

const canUsePluginMethods = {
  async: [
    'setPropsConfig',
    'getPropsConfig',
    'setPropsValue',
    'getPropsValue',
    'createId',
    'setNewItemId',
    'fillConfig',
    'getDefaultPropsValue',
  ] as const,
};
class Props extends BaseService {
  private state = reactive<PropsState>({
    propsConfigMap: {},
    propsValueMap: {},
  });

  constructor() {
    super(
      canUsePluginMethods.async.map(methodName => ({ name: methodName, isAsync: true })),
    );
  }

  public setPropsConfigs(configs: Record<string, FormConfig>) {
    Object.keys(configs).forEach((type: string) => {
      this.setPropsConfig(toLine(type), configs[type]);
    });
    this.emit('props-configs-change');
  }

  public async fillConfig(config: FormConfig) {
    return fillConfig(config);
  }

  /**
   * 为指定类型组件设置组件属性表单配置
   * @param type 组件类型
   * @param config 组件属性表单配置
   */
  public async setPropsConfig(type: string, config: FormConfig) {
    this.state.propsConfigMap[type] = await this.fillConfig(Array.isArray(config) ? config : [config]);
  }

  /**
   * 获取指点类型的组件属性表单配置
   * @param type 组件类型
   * @returns 组件属性表单配置
   */
  public async getPropsConfig(type: string): Promise<FormConfig> {
    if (type === 'area') {
      return await this.getPropsConfig('button');
    }

    return cloneDeep(this.state.propsConfigMap[type] || (await this.fillConfig([])));
  }

  public destroy() {
    this.state.propsConfigMap = {};
    this.state.propsValueMap = {};
    this.removeAllListeners();
  }

  public setPropsValues(values: Record<string, MNode>) {
    Object.keys(values).forEach((type: string) => {
      this.setPropsValue(toLine(type), values[type]);
    });
  }

  /**
   * 为指点类型组件设置组件初始值
   * @param type 组件类型
   * @param value 组件初始值
   */
  public setPropsValue(type: string, value: MNode) {
    this.state.propsValueMap[type] = value;
  }

  /**
   * 获取指定类型的组件初始值
   * @param type 组件类型
   * @returns 组件初始值
   */
  public async getPropsValue(type: string, { inputEvent, ...defaultValue }: Record<string, any> = {}) {
    if (type === 'area') {
      const value = (await this.getPropsValue('button')) as MComponent;
      value.className = 'action-area';
      value.text = '';
      if (value.style) {
        value.style.backgroundColor = 'rgba(255, 255, 255, 0)';
      }
      return value;
    }

    const [id, defaultPropsValue, data] = await Promise.all([
      this.createId(type),
      this.getDefaultPropsValue(type),
      this.setNewItemId(
        cloneDeep({
          type,
          ...defaultValue,
        } as any),
      ),
    ]);

    return {
      id,
      ...defaultPropsValue,
      ...mergeWith({}, cloneDeep(this.state.propsValueMap[type] || {}), data),
    };
  }

  /**
   * 生成指定位数的GUID，无【-】格式
   * @param digit 位数，默认值8
   * @returns
   */
  private guid(digit = 8): string {
    return 'x'.repeat(digit).replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  public async createId(type: string | number): Promise<string> {
    return `${type}_${this.guid()}`;
  }

  /**
   * 将组件与组件的子元素配置中的id都设置成一个新的ID
   * @param {object} config 组件配置
   */
  /* eslint no-param-reassign: ["error", { "props": false }] */
  public async setNewItemId(config: MNode) {
    config.id = await this.createId(config.type || 'component');

    if (config.items && Array.isArray(config.items)) {
      for (const item of config.items) {
        await this.setNewItemId(item);
      }
    }

    return config;
  }

  /**
   * 获取默认属性配置
   * @param type 组件类型
   * @returns Object
   */
  public async getDefaultPropsValue(type: string) {
    return ['page', 'container'].includes(type)
      ? {
          type,
          layout: 'absolute',
          style: {},
          name: type,
          items: [],
        }
      : {
          type,
          style: {},
          name: type,
        };
  }
}

export type PropsService = Props;

export default new Props();
