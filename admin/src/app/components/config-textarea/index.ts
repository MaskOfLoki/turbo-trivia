import m, { VnodeDOM } from 'mithril';
import { ConfigControl, IConfigControlAttrs } from '../config-control';
import { TextAreaTemplate } from './template';

export interface IConfigTextAreaAttrs extends IConfigControlAttrs {
  defaultValue?: string;
}

export class ConfigTextArea extends ConfigControl {
  private _attrs: IConfigTextAreaAttrs;

  public onbeforeupdate(vnode: VnodeDOM): void {
    this._attrs = vnode.attrs as IConfigTextAreaAttrs;
  }

  public inputChangeHandler(value: string, trim = false) {
    if (this.value === value) {
      return;
    }

    if (trim) {
      value = value.trim();
    }

    if (value == '') {
      this._configValue = undefined;
    } else {
      this._configValue = value;
    }

    if (this._configValue === this._attrs?.defaultValue) {
      this._configValue = undefined;
    }

    this.valueChangeHandler(this._configValue);
  }

  public template(attrs: IConfigTextAreaAttrs) {
    const inputAttrs = { ...attrs };
    delete inputAttrs.configField;

    return TextAreaTemplate.call(this, attrs);
  }
}
