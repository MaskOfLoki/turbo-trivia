import { ClassComponent, Vnode, VnodeDOM } from 'mithril';
import { template } from './template';
import Lottie, {
  AnimationItem,
  AnimationConfigWithPath,
  AnimationConfigWithData,
  AnimationEventName,
  AnimationEventCallback,
} from 'lottie-web';

export interface IXCAnimateAEAttrs {
  config?: IXCAnimateConfig;
}

export interface IXCAnimateConfig {
  animation: {
    data: string | any;
    autoplay?: boolean;
    loop?: boolean | number;
    initialSegment?: [number, number];
  };
  id: string;
  timeout?: number;
  width?: number | string;
  height?: number | string;
  style?: string;
  onclickPlay?: boolean;
  onclick?: (e: Event) => any;
  eventListeners?: IEventListener[];
  play?: boolean;
  pingpong?: boolean;
}

export interface IEventListener {
  eventName: AnimationEventName;
  callback: AnimationEventCallback;
}

export class XCAnimateAE implements ClassComponent<IXCAnimateAEAttrs> {
  private _anim: AnimationItem;
  private _domEl: HTMLElement;
  private _id: string;
  private _attrs: IXCAnimateAEAttrs;
  private _width: string | number;
  private _height: string | number;

  private _defaultOptions: AnimationConfigWithPath | AnimationConfigWithData;

  public oninit({ attrs }: Vnode<IXCAnimateAEAttrs>) {
    this._attrs = attrs;
  }

  public oncreate({ dom, attrs }: VnodeDOM<IXCAnimateAEAttrs>) {
    this._domEl = dom as HTMLElement;

    this._defaultOptions = {
      container: this._domEl,
      renderer: 'svg',
      autoplay: false,
      loop: false,
      animationData: attrs.config.animation.data,
    };

    this._width = attrs.config.width;
    this._height = attrs.config.height;

    this._id = attrs.config.id || 'lottie';

    this._defaultOptions = { ...this._defaultOptions, ...attrs.config.animation };
    this._anim = Lottie.loadAnimation(this._defaultOptions);

    if (attrs.config.eventListeners) {
      this.registerEventListeners(attrs.config.eventListeners);
    }

    if (attrs.config.pingpong) {
      this._anim.addEventListener('complete', () => {
        this._anim.setDirection(this._anim.playDirection === 1 ? -1 : 1);
      });
    }
    if (attrs.config.onclick || attrs.config.onclickPlay) {
      this.clickListener = (e: Event) => {
        if (attrs.config.onclick) {
          attrs.config.onclick(e);
        }
        if (attrs.config.onclickPlay) {
          if (this._anim.currentRawFrame + 1 !== this._anim.getDuration(true) && this._anim.currentRawFrame !== 0) {
            this._anim.triggerEvent('complete', {});
          }
          this._anim.play();
        }
      };
      // eslint-disable-next-line
      this._domEl.addEventListener('click', this.clickListener);
    }
    if (attrs.config.play) {
      if (attrs.config.timeout) {
        setTimeout(() => {
          this._anim.play();
        }, attrs.config.timeout);
      } else {
        this._anim.play();
      }
    }
  }

  // eslint-disable-next-line
  private clickListener(e: Event) { }

  private registerEventListeners(eventListeners: IEventListener[]) {
    eventListeners.forEach((listener) => {
      this._anim.addEventListener(listener.eventName, listener.callback);
    });
  }

  public onbeforeupdate(vnode: Vnode<IXCAnimateAEAttrs, this>, oldVnode: Vnode<IXCAnimateAEAttrs, this>) {
    if (vnode.attrs.config !== oldVnode.attrs.config) {
      if (vnode.attrs.config.play && !oldVnode.attrs.config.play) {
        this._anim.play();
      } else if (!vnode.attrs.config.play && oldVnode.attrs.config.play) {
        this._anim.stop();
      }
      return true;
    } else {
      return false;
    }
  }

  private destroyEventListeners() {
    // eslint-disable-next-line
    if (this._attrs.config.onclick || this._attrs.config.onclickPlay) {
      // eslint-disable-next-line
      this._domEl.removeEventListener('click', this.clickListener);
    }
    if (this._attrs.config.eventListeners) {
      this._attrs.config.eventListeners.forEach((listener) => {
        this._anim.removeEventListener(listener.eventName, listener.callback);
      });
    }
    if (this._attrs.config.pingpong) {
      this._anim.removeEventListener('complete');
    }
  }

  public onremove() {
    this.destroyEventListeners();
    this._anim = null;
    this._defaultOptions = null;
    this._height = null;
    this._width = null;
    this._domEl = null;
  }

  public view({ attrs }: Vnode<IXCAnimateAEAttrs>) {
    return template.call(this);
  }

  public get width() {
    return this._width;
  }
  public get height() {
    return this._height;
  }

  public get id() {
    return this._id;
  }
}
export default XCAnimateAE;
