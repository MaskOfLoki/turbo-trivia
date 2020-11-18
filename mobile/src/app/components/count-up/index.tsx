import m, { VnodeDOM, Vnode, ClassComponent } from 'mithril';
import { CountUp as CU } from 'countup.js';

export interface ICountUpAttrs {
  startValue: number;
  endValue: number;
  duration?: number;
  suffix?: string;
  separator?: string;
  useEasing?: boolean;
  onComplete?: IOnComplete;
  start?: boolean;
}

export interface IOnComplete {
  function: (args?: any) => any;
  args?: any;
}

export class XCCountUp implements ClassComponent<ICountUpAttrs> {
  private _element: HTMLElement;
  private _countup: CU;
  private _startValue = 0;
  private _endValue = 0;
  private _start = false;

  public oncreate({ dom, attrs, children }: VnodeDOM<ICountUpAttrs>) {
    if (attrs.startValue) {
      this._startValue = attrs.startValue;
    }
    if (attrs.endValue) {
      this._endValue = attrs.endValue;
    }
    if (attrs.start) {
      this._start = attrs.start;
    }
    this._element = dom as HTMLElement;

    if (!this._element) {
      console.warn('CountUp.oncreate: vnode.dom is undefined');
      return;
    }

    this._countup = new CU(this._element, this._endValue, {
      // tslint:disable-next-line
      duration: attrs.duration ?? 2,
      // tslint:disable-next-line
      suffix: attrs.suffix ?? '',
      // tslint:disable-next-line
      separator: attrs.separator ?? '',
      startVal: this._startValue,
      useEasing: attrs.useEasing ?? false,
    });
    if (this._start) {
      this._countup.start(() => {
        attrs.onComplete.function
          ? attrs.onComplete.function(
              // tslint:disable-next-line: no-unused-expression
              attrs.onComplete.args ? attrs.onComplete.args : null,
            )
          : null;
      });
    }
  }

  public onbeforeupdate({ attrs }: Vnode<ICountUpAttrs, this>, oldVnode: Vnode<ICountUpAttrs, this>) {
    if (!this._countup || attrs === oldVnode.attrs) {
      return false;
    } else {
      if (attrs.endValue !== oldVnode.attrs.endValue && this._endValue !== oldVnode.attrs.endValue) {
        this._startValue = this._endValue;
        this._endValue = attrs.endValue;
        this._countup.update(this._endValue);
      }
      if (attrs.start && !oldVnode.attrs.start) {
        this._endValue = attrs.endValue;
        this._countup.update(this._endValue);
        this._countup.start(() => {
          attrs.onComplete.function
            ? attrs.onComplete.function(
                // tslint:disable-next-line: no-unused-expression
                attrs.onComplete.args ? attrs.onComplete.args : null,
              )
            : null;
        });
      } else if (!attrs.start && oldVnode.attrs.start) {
        this._countup.pauseResume();
      }
      return true;
    }
  }

  public view() {
    return <div />;
  }
}
