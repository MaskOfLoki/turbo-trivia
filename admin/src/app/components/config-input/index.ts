import { VnodeDOM } from 'mithril';
import Swal from 'sweetalert2';
import { validURL } from '../../utils';
import { ConfigControl, IConfigControlAttrs } from '../config-control';
import { InputTemplate } from './template';

export interface IConfigInputAttrs extends IConfigControlAttrs {
  defaultValue?: string;
  type?: string;
}

export class ConfigInput extends ConfigControl {
  private _attrs: IConfigInputAttrs;

  public onbeforeupdate(vnode: VnodeDOM): void {
    this._attrs = vnode.attrs as IConfigInputAttrs;
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

    if (this._configValue === this._attrs.defaultValue) {
      this._configValue = undefined;
    }

    if (this._attrs.type == 'url' && !validURL(this._configValue)) {
      Swal.fire({
        icon: 'warning',
        title: 'Please, provide valid url.',
      });
      return;
    }

    this.valueChangeHandler(this._configValue);
  }

  public template(attrs: IConfigInputAttrs) {
    const inputAttrs = { ...attrs };
    delete inputAttrs.configField;

    return InputTemplate.call(this, inputAttrs);
  }
}
