import m from 'mithril';
import { ConfigControl } from '../config-control';
import { FontUpload } from '../font-upload';
import { isEmptyString } from '@gamechangerinteractive/xc-backend/utils';

export class ConfigFontFileUpload extends ConfigControl {
  protected valueChangeHandler(value: string) {
    if (isEmptyString(value)) {
      value = null;
    }

    super.valueChangeHandler(value);
  }

  public template(attrs) {
    return m(FontUpload, {
      ...attrs,
      value: this.value,
      onchange: this.valueChangeHandler.bind(this),
    });
  }
}
