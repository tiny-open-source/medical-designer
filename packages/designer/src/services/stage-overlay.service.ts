import type { StageOptions, StageOverlayState } from '@designer/type';
import type StageCore from '@low-code/stage';

// import { getIdFromEl } from '@low-code/utils';
import { shallowReactive } from 'vue';
import { useStage } from '../utils';
import BaseService from './base.service';
import designerService from './designer.service';

const canUsePluginMethods = {
  async: [],
  sync: ['openOverlay', 'closeOverlay', 'updateOverlay', 'createStage'] as const,
};
class StageOverlay extends BaseService {
  private state: StageOverlayState = shallowReactive({
    wrapDiv: document.createElement('div'),
    sourceEl: null,
    contentEl: null,
    stage: null,
    stageOptions: null,
    wrapWidth: 0,
    wrapHeight: 0,
    stageOverlayVisible: false,
  });

  constructor() {
    super(canUsePluginMethods.sync.map(methodName => ({ name: methodName, isAsync: false })));

    this.get('wrapDiv').classList.add('low-code-sub-stage-wrap');
  }

  public get<K extends keyof StageOverlayState>(name: K): StageOverlayState[K] {
    return this.state[name];
  }

  public set<K extends keyof StageOverlayState, T extends StageOverlayState[K]>(name: K, value: T) {
    this.state[name] = value;
  }

  public openOverlay(el: HTMLElement | null) {
    const stageOptions = this.get('stageOptions');

    if (!el || !stageOptions)
      return;

    this.set('sourceEl', el);

    this.createContentEl();

    this.set('stageOverlayVisible', true);

    designerService.on('update', this.updateHandler);
    designerService.on('add', this.addHandler);
    designerService.on('remove', this.removeHandler);
    designerService.on('drag-to', this.updateHandler);
    designerService.on('move-layer', this.updateHandler);
  }

  public closeOverlay() {
    this.set('stageOverlayVisible', false);
    const subStage = this.get('stage');
    const wrapDiv = this.get('wrapDiv');
    subStage?.destroy();

    for (let i = 0, l = wrapDiv.children.length; i < l; i++) {
      const child = wrapDiv.children[i];
      child.remove();
    }

    wrapDiv.remove();

    this.set('stage', null);
    this.set('sourceEl', null);
    this.set('contentEl', null);

    designerService.off('update', this.updateHandler);
    designerService.off('add', this.addHandler);
    designerService.off('remove', this.removeHandler);
    designerService.off('drag-to', this.updateHandler);
    designerService.off('move-layer', this.updateHandler);
  }

  public updateOverlay() {
    const sourceEl = this.get('sourceEl');

    if (!sourceEl)
      return;

    const { scrollWidth, scrollHeight } = sourceEl;

    this.set('wrapWidth', scrollWidth);
    this.set('wrapHeight', scrollHeight);
  }

  public createStage(stageOptions: StageOptions) {
    return useStage({
      ...stageOptions,
      runtimeUrl: '',
      autoScrollIntoView: false,
      zoom: 1,
      render: async (stage: StageCore) => {
        this.copyDocumentElement();

        const rootEls = stage.renderer?.getDocument()?.body.children;
        if (rootEls) {
          Array.from(rootEls).forEach((element) => {
            if (['SCRIPT', 'STYLE'].includes(element.tagName)) {
              return;
            }
            element.remove();
          });
        }

        const wrapDiv = this.get('wrapDiv');

        await this.render();

        return wrapDiv;
      },
    });
  }

  private createContentEl() {
    const sourceEl = this.get('sourceEl');
    if (!sourceEl)
      return;

    const contentEl = sourceEl.cloneNode(true) as HTMLElement;
    this.set('contentEl', contentEl);

    contentEl.style.position = 'static';
    contentEl.style.overflow = 'visible';
  }

  private copyDocumentElement() {
    const subStage = this.get('stage');
    const stage = designerService.get('stage');

    const doc = subStage?.renderer?.getDocument();
    const documentElement = stage?.renderer?.getDocument()?.documentElement;

    if (doc && documentElement) {
      doc.replaceChild(documentElement.cloneNode(true), doc.documentElement);
    }
  }

  private async render() {
    this.createContentEl();

    const contentEl = this.get('contentEl');
    const sourceEl = this.get('sourceEl');
    const wrapDiv = this.get('wrapDiv');
    const subStage = this.get('stage');
    const stageOptions = this.get('stageOptions');

    if (!contentEl)
      return;

    wrapDiv.style.cssText = `
      width: ${sourceEl?.scrollWidth}px;
      height: ${sourceEl?.scrollHeight}px;
      background-color: #fff;
    `;

    for (let i = 0, l = wrapDiv.children.length; i < l; i++) {
      const child = wrapDiv.children[i];
      child.remove();
    }
    wrapDiv.appendChild(contentEl);
    setTimeout(async () => {
      subStage?.renderer?.contentWindow?.['low-code'].onPageElUpdate(wrapDiv);
      if (await stageOptions?.canSelect?.(contentEl)) {
        const id = contentEl.id;
        id && subStage?.select(id);
      }
    });
  }

  private updateHandler = () => {
    setTimeout(() => {
      this.render();
      this.updateOverlay();

      this.updateSelectStatus();
    });
  };

  private addHandler = () => {
    this.render();
    this.updateOverlay();

    this.updateSelectStatus();
  };

  private removeHandler = () => {
    this.render();
    this.updateOverlay();

    this.updateSelectStatus();
  };

  private updateSelectStatus() {
    const subStage = this.get('stage');
    const nodes = designerService.get('nodes');
    if (nodes.length > 1) {
      subStage?.multiSelect(nodes.map(n => n.id));
    }
    else {
      subStage?.select(nodes[0].id);
    }
  }
}

export type StageOverlayService = StageOverlay;

export default new StageOverlay();
