import type { ComponentGroup, ComponentGroupState } from '../type';

import { reactive } from 'vue';

import BaseService from './base.service';

class ComponentList extends BaseService {
  private state = reactive<ComponentGroupState>({
    list: [],
  });

  constructor() {
    super([]);
  }

  public getList(): ComponentGroup[] {
    return this.state.list;
  }

  /**
   * @param componentGroupList 组件列表配置
   */
  public setList(componentGroupList: ComponentGroup[]) {
    this.state.list = componentGroupList;
  }

  public destroy() {
    this.state.list = [];
    this.removeAllListeners();
  }
}

export type ComponentListService = ComponentList;

export default new ComponentList();
