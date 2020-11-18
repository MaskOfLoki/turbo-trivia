import { ClassComponent, Vnode, VnodeDOM, redraw } from 'mithril';
import { template } from './template';
import { Unsubscribable } from 'rxjs';
import { randInt } from '@gamechangerinteractive/xc-backend/utils';
import { IConfig, fillDefaultConfig, MainboardPreviewPage } from '../../../../../common/common';
import { api } from '../../services/api';

export interface IMainboardPreviewAttrs {
  page: MainboardPreviewPage;
  class: string;
  ref: (value: MainboardPreview) => void;
}

export class MainboardPreview implements ClassComponent<IMainboardPreviewAttrs> {
  private _element: HTMLElement;
  private _url: string;
  private _page: MainboardPreviewPage;
  private _subscription: Unsubscribable;
  private _id: number = randInt(1000000000);

  public oncreate(vnode: VnodeDOM<IMainboardPreviewAttrs>) {
    this._element = vnode.dom as HTMLElement;
    redraw();
  }

  public view(vnode: Vnode<IMainboardPreviewAttrs>) {
    return template.call(this, vnode);
  }

  public onbeforeupdate({ attrs }: Vnode<IMainboardPreviewAttrs>) {
    if (this._page === attrs.page) {
      return;
    }

    this._page = attrs.page;
    this.refresh(attrs);
  }

  private async refresh(attrs: IMainboardPreviewAttrs) {
    const nextDeployStack = window.location.pathname.includes('next') ? '/next' : '';

    this._url = GC_PRODUCTION
      ? `${nextDeployStack}/turbo-trivia-2/mainboard?previewPage=${this._page}&previewId=${this._id}`
      : `http://localhost:8082/?gcClientId=${api.cid}&previewPage=${this._page}&previewId=${this._id}`;

    await this.waitForPreview();

    if (attrs.ref) {
      attrs.ref(this);
    }

    if (this._subscription) {
      this._subscription.unsubscribe();
      this._subscription = undefined;
    }

    const namespaces = ['common'];

    this._subscription = api.config(...namespaces).subscribe(this.updateConfig.bind(this));
  }

  private waitForPreview() {
    return new Promise((resolve) => {
      const messageHandler = (event: MessageEvent) => {
        if (event.data === `previewReady${this._id}`) {
          window.removeEventListener('message', messageHandler);
          resolve();
        }
      };

      window.addEventListener('message', messageHandler);
    });
  }

  public updateConfig(config: IConfig) {
    config = fillDefaultConfig(config);
    this.postMessage({
      type: 'updateConfig',
      id: this._id,
      config,
    });
  }

  private postMessage(value) {
    if (this.iframe?.contentWindow) {
      this.iframe.contentWindow.postMessage(value, '*');
    }
  }

  public get url(): string {
    return this._url;
  }

  private get iframe(): HTMLIFrameElement {
    return this._element.querySelector('iframe');
  }
}
