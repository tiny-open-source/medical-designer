import type { EventItemConfig, Id, MApp } from '@low-code/schema';
import { EventEmitter } from 'eventemitter3';
import Env from './Env';
import { bindCommonEventListener, DEFAULT_EVENTS, getCommonEventName, isCommonMethod, triggerCommonMethod } from './events';
import Page from './Page';
import { fillBackgroundImage, isNumber, style2Obj } from './utils';

interface AppOptionsConfig {
  ua?: string;
  config?: MApp;
  platform?: PlatformType;
  jsEngine?: 'browser';
  curPage?: Id;
  transformStyle?: (style: Record<string, any>) => Record<string, any>;
}

type PlatformType = 'designer' | 'device' | 'browser';

interface EventCache {
  eventConfig: EventItemConfig;
  fromCpt: unknown;
  args: unknown[];
}

interface ZoomRatio {
  x: number;
  y: number;
}

class App extends EventEmitter {
  private readonly env: Env;
  private readonly pages: Map<Id, Page> = new Map();
  private readonly components: Map<string, unknown> = new Map();

  public platform: PlatformType = 'device';
  public jsEngine = 'browser';
  public rootFontSize: string;
  public page?: Page;
  public zoomRatio: ZoomRatio = { x: 1, y: 1 };
  public eventQueueMap: Record<string, EventCache[]> = {};

  constructor(options: AppOptionsConfig) {
    super();
    this.env = new Env();
    this.rootFontSize = document.documentElement.style.fontSize;

    this.initializeApp(options);
  }

  private initializeApp(options: AppOptionsConfig): void {
    const { platform, jsEngine, transformStyle, config, curPage } = options;

    if (platform)
      this.platform = platform;
    if (jsEngine)
      this.jsEngine = jsEngine;

    if (this.platform === 'device' || this.platform === 'browser') {
      this.initializeFontSize();
    }

    if (transformStyle) {
      this.transformStyle = transformStyle;
    }

    if (config) {
      this.setConfig(config, curPage);
    }

    bindCommonEventListener(this);
  }

  private initializeFontSize(): void {
    const calcFontsize = (): void => {
      let { width } = document.documentElement.getBoundingClientRect();
      width = Math.max(600, width);
      const fontSize = width / 10.24;
      this.rootFontSize = document.documentElement.style.fontSize = `${fontSize}px`;
    };

    calcFontsize();
    document.body.style.fontSize = '14px';
    globalThis.addEventListener('resize', calcFontsize);
  }

  public transformStyle(style: Record<string, any>): Record<string, any> {
    if (!style)
      return {};

    const styleObj = typeof style === 'string' ? style2Obj(style) : { ...style };
    return this.processStyleProperties(styleObj);
  }

  private processStyleProperties(styleObj: Record<string, any>): Record<string, any> {
    const results: Record<string, any> = {};
    const whiteList = ['zIndex', 'opacity', 'fontWeight'];

    Object.entries(styleObj).forEach(([key, value]) => {
      results[key] = this.processStyleProperty(key, value, whiteList);
    });

    return results;
  }

  private processStyleProperty(key: string, value: any, whiteList: string[]): any {
    if (!value)
      return value;

    if (key === 'backgroundImage') {
      return fillBackgroundImage(value);
    }

    if (key === 'transform' && typeof value !== 'string') {
      return this.processTransform(value);
    }

    if (!whiteList.includes(key) && /^-?\d*(?:\.\d*)?$/.test(value)) {
      return this.convertToPx(key, Number(value));
    }

    return value;
  }

  private processTransform(value: Record<string, string>): string {
    if (!value)
      return 'none';

    const transform = Object.entries(value).map(([transformKey, transformValue]) => {
      if (!transformValue.trim())
        return '';
      if (transformKey === 'rotate' && isNumber(transformValue)) {
        transformValue = `${transformValue}deg`;
      }

      return `${transformKey}(${transformValue})`;
    });

    const values = transform.join(' ');
    return !values.trim() ? 'none' : values;
  }

  private convertToPx(key: string, value: any): string {
    let radio = 1;
    if (key === 'height' || key === 'top') {
      radio = this.zoomRatio.y;
    }
    else {
      radio = this.zoomRatio.x;
    }
    return `${value * radio}px`;
  }

  public setConfig(config: MApp, curPage?: Id): void {
    this.pages.clear();

    config.items?.forEach((page) => {
      this.pages.set(
        page.id,
        new Page({
          config: page,
          app: this,
        }),
      );
    });

    this.setPage(curPage || this.page?.data?.id);
  }

  public setPage(id?: Id): void {
    let page;

    if (id) {
      page = this.pages.get(id);
    }

    if (!page) {
      page = this.pages.get(this.pages.keys().next().value!);
    }

    this.page = page;

    if (this.platform !== 'browser') {
      this.bindEvents();
    }
    this.calcZoomRatio(page);
  }

  public calcZoomRatio(page?: Page): void {
    if (!page)
      return;
    if (this.platform !== 'device')
      return;

    const templateWidth = Number(page.data.style!.width);
    const templateHeight = Number(page.data.style!.height);
    if (!templateWidth || !templateHeight)
      throw new Error('模板页面宽高不明确');
    const { width: screenWidth, height: screenHeight } = document.documentElement.getBoundingClientRect();

    this.zoomRatio = {
      x: screenWidth / templateWidth,
      y: screenHeight / templateHeight,
    };
    console.log('🚀 ~ App ~ calcZoomRatio ~ this.zoomRatio:', this.zoomRatio);
  }

  public registerComponent(type: string, Component: any): void {
    this.components.set(type, Component);
  }

  public unregisterComponent(type: string): void {
    this.components.delete(type);
  }

  public resolveComponent(type: string): any {
    return this.components.get(type);
  }

  public bindEvents(): void {
    if (!this.page)
      return;

    this.removeAllListeners();

    for (const [, value] of this.page.nodes) {
      value.events?.forEach(event => this.bindEvent(event, `${value.data.id}`));
    }
  }

  public bindEvent(event: EventItemConfig, id: string): void {
    let { name: eventName } = event;
    if (DEFAULT_EVENTS.findIndex(defaultEvent => defaultEvent.value === eventName) > -1) {
      eventName = getCommonEventName(eventName, id);
    }

    this.on(eventName, (fromCpt, ...args) => {
      this.eventHandler(event, fromCpt, args);
    });
  }

  public async eventHandler(eventConfig: EventItemConfig, fromCpt: unknown, args: unknown[]): Promise<void> {
    if (!this.page) {
      throw new Error('No active page found');
    }

    const { method: methodName, to } = eventConfig;
    const toNode = this.page.getNode(to);

    if (!toNode) {
      throw new Error(`Component with ID ${to} does not exist`);
    }

    try {
      if (isCommonMethod(methodName)) {
        await triggerCommonMethod(methodName, toNode);
        return;
      }

      if (toNode.instance?.exposed?.[methodName]) {
        await toNode.instance.exposed[methodName](fromCpt, ...args);
        return;
      }

      this.addEventToMap({ eventConfig, fromCpt, args });
    }
    catch (error) {
      console.error(`Error handling event ${methodName}:`, error);
      throw error;
    }
  }

  public destroy(): void {
    this.removeAllListeners();
    this.pages.clear();
  }

  private addEventToMap(event: EventCache): void {
    if (this.eventQueueMap[event.eventConfig.to]) {
      this.eventQueueMap[event.eventConfig.to].push(event);
    }
    else {
      this.eventQueueMap[event.eventConfig.to] = [event];
    }
  }
}

export default App;
