import { ClassComponent, Vnode, VnodeDOM, redraw } from 'mithril';
import { template } from './template';
import { Unsubscribable } from 'rxjs';
import { randInt } from '@gamechangerinteractive/xc-backend/utils';
import { MobilePreviewMode, IConfig, fillDefaultConfig, MobilePreviewPage } from '../../../../../common/common';
import { api } from '../../services/api';

export interface IMobilePreviewAttrs {
  mode: MobilePreviewMode;
  page: MobilePreviewPage;
  class: string;
  ref: (value: MobilePreview) => void;
}

export class MobilePreview implements ClassComponent<IMobilePreviewAttrs> {
  private _element: HTMLElement;
  private _url: string;
  private _mode: MobilePreviewMode;
  private _page: MobilePreviewPage;
  private _subscription: Unsubscribable;
  private _id: number = randInt(1000000000);

  public oncreate(vnode: VnodeDOM<IMobilePreviewAttrs>) {
    this._element = vnode.dom as HTMLElement;
    redraw();
  }

  public view(vnode: Vnode<IMobilePreviewAttrs>) {
    return template.call(this, vnode);
  }

  public onbeforeupdate({ attrs }: Vnode<IMobilePreviewAttrs>) {
    if (this._mode === attrs.mode && this._page === attrs.page) {
      return;
    }

    this._mode = attrs.mode ? attrs.mode : MobilePreviewMode.MOBILE;
    this._page = attrs.page;
    this.refresh(attrs);
  }

  private async refresh(attrs: IMobilePreviewAttrs) {
    const nextDeployStack = window.location.pathname.includes('next') ? '/next' : '';

    this._url = GC_PRODUCTION
      ? `${nextDeployStack}/turbo-trivia-2/?previewMode=${this._mode}&previewPage=${this._page}&previewId=${this._id}`
      : `http://localhost:8081/?gcClientId=${api.cid}&previewMode=${this._mode}&previewPage=${this._page}&previewId=${this._id}`;

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
