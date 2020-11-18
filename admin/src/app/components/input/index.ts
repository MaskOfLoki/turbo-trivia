import { ClassComponent, Vnode, VnodeDOM, redraw } from 'mithril';
import { template } from './template';

export interface IInputAttrs {
  label?: string;
  maxlength?: number;
  [index: string]: any;
  value?: string;
}

export class Input implements ClassComponent<IInputAttrs> {
  private _input: HTMLInputElement;

  public oncreate(vnode: VnodeDOM<IInputAttrs>) {
    this._input = vnode.dom.querySelector('input');
    redraw();
  }

  public view({ attrs }: Vnode<IInputAttrs>) {
    return template.call(this, attrs);
  }

  public get value(): string {
    return this._input?.value;
  }
}
