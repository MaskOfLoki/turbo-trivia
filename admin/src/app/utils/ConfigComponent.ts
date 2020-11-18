import { ClassComponent, Vnode, redraw } from 'mithril';
import { ISlot } from '../../../../common/common';

export interface IConfigComponentAttrs {
  slot: ISlot;
  slots: ISlot[];
  saveConfig: () => Promise<void>;
  changeSlot: (slot: ISlot) => void;
}

export abstract class ConfigComponent<T extends IConfigComponentAttrs> implements ClassComponent<T> {
  protected _slot: ISlot;
  protected _slots: ISlot[];
  public saveConfig: () => Promise<void>;
  public changeSlot: (slot: ISlot) => void;

  public oninit(vnode: Vnode<T>) {
    this.onbeforeupdate(vnode);
  }

  public onbeforeupdate({ attrs }: Vnode<T>) {
    this.saveConfig = attrs.saveConfig;
    this.changeSlot = attrs.changeSlot;

    if (this._slot !== attrs.slot) {
      this._slot = attrs.slot;
    }

    if (this._slots != attrs.slots) {
      this._slots = attrs.slots;
    }
  }

  public get slot(): ISlot {
    return this._slot;
  }

  public get slots(): ISlot[] {
    return this._slots;
  }

  public abstract view(vnode: Vnode<T>);
}
