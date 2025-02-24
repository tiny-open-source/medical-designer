import type { EventOption } from '@lowcode/core';
import { DEFAULT_EVENTS, DEFAULT_METHODS } from '@lowcode/core';
import { toLine } from '@lowcode/utils';
import { cloneDeep } from 'lodash-es';
import { reactive } from 'vue';
import BaseService from './base.service';

let eventMap: Record<string, EventOption[]> = reactive({});
let methodMap: Record<string, EventOption[]> = reactive({});

class Events extends BaseService {
  constructor() {
    super([]);
  }

  public setEvents(events: Record<string, EventOption[]>) {
    Object.keys(events).forEach((type: string) => {
      this.setEvent(toLine(type), events[type] || []);
    });
  }

  public setEvent(type: string, events: EventOption[]) {
    eventMap[type] = [...DEFAULT_EVENTS, ...events];
  }

  public getEvent(type: string): EventOption[] {
    return cloneDeep(eventMap[type] || DEFAULT_EVENTS);
  }

  public setMethods(methods: Record<string, EventOption[]>) {
    Object.keys(methods).forEach((type: string) => {
      this.setMethod(toLine(type), methods[type] || []);
    });
  }

  public setMethod(type: string, method: EventOption[]) {
    methodMap[type] = [...DEFAULT_METHODS, ...method];
  }

  public getMethod(type: string) {
    return cloneDeep(methodMap[type] || DEFAULT_METHODS);
  }

  public destroy() {
    eventMap = reactive({});
    methodMap = reactive({});
    this.removeAllListeners();
  }
}
export type EventsService = Events;

export default new Events();
