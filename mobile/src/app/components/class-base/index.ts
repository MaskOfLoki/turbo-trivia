import { ClassComponent, VnodeDOM } from 'mithril';
import { Unsubscribable } from 'rxjs';

export abstract class ClassBaseComponent<T = {}> implements ClassComponent {
  protected _element: HTMLElement;
  protected _subscriptions: Unsubscribable[];

  constructor() {
    this._subscriptions = [];
  }

  public oncreate(vnode: VnodeDOM) {
    this._element = vnode.dom as HTMLElement;
  }

  public abstract view(T);

  public onremove() {
    this._subscriptions.forEach((item) => item.unsubscribe());
  }
}
