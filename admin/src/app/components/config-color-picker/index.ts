import m from 'mithril';
import { ColorPicker } from '../color-picker';
import { IConfigControlAttrs, ConfigControl } from '../config-control';

interface IConfigColorPickerAttrs extends IConfigControlAttrs {
  defaultColor?: string;
  gradient?: boolean;
}

export class ConfigColorPicker extends ConfigControl {
  public template(attrs: IConfigColorPickerAttrs) {
    return m(ColorPicker, {
      color: this.value || attrs.defaultColor,
      candelete: this.value,
      gradient: attrs.gradient,
      ondelete: this.valueChangeHandler.bind(this),
      onchange: this.valueChangeHandler.bind(this),
    });
  }
}
