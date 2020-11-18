import { ClassComponent, redraw, Vnode, VnodeDOM } from 'mithril';
import { template } from './template';

export interface ICircleCountDownAttrs {
  value: number;
  values: number[];
  onchange: (value: number) => void;
  disable?: boolean;
  label: string;
  onchangeinput: (value: number) => void;
}

export class CircleCountDown implements ClassComponent<ICircleCountDownAttrs> {
  public element: HTMLDivElement;
  public oncreate(vnode: VnodeDOM) {
    this.element = vnode.dom as HTMLDivElement;
    redraw();
  }

  public view(vnode: Vnode<ICircleCountDownAttrs>) {
    return template.call(this, vnode.attrs);
  }
}
