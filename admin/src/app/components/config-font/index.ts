import { isEmptyString } from '@gamechangerinteractive/xc-backend/utils';
import m, { redraw, VnodeDOM } from 'mithril';
import { api } from '../../services/api';
import { ConfigControl, IConfigControlAttrs } from '../config-control';
import { ConfigTemplate } from './template';

export interface IConfigFontAttrs extends IConfigControlAttrs {
  defaultValue?: string;
}

export const FONT_LIST = [
  {
    value: 'Selection1-Bold',
    name: 'ENDZONE SANS BOLD',
  },
  {
    value: 'Selection1-MediumCondensed',
    name: 'ENDZONE SANS MEDIUM CONDENSED',
  },
  { value: 'Selection1-LightItalic', name: 'ENDZONE SANS LIGHT ITALIC' },
  { value: 'Selection1-Medium', name: 'ENDZONE SANS MEDIUM' },
  { value: 'Selection2', name: 'JAWBREAK SANS' },
  { value: 'Selection3-Black', name: 'ROBOTO BLACK' },
  { value: 'Selection3-BlackItalic', name: 'ROBOTO BLACK ITALIC' },
  { value: 'Selection3-Bold', name: 'ROBOTO BOLD' },
  { value: 'Selection3-Italic', name: 'ROBOTO ITALIC' },
  { value: 'Selection3-Medium', name: 'ROBOTO MEDIUM' },
  { value: 'Selection3-Regular', name: 'ROBOTO REGULAR' },
  { value: 'Custom', name: 'CUSTOM' },
];

export class ConfigFont extends ConfigControl {
  private _attrs: IConfigFontAttrs;
  public customFont: string;

  public oncreate(vnode: VnodeDOM): void {
    this.onbeforeupdate(vnode);
  }

  public onbeforeupdate(vnode: VnodeDOM): void {
    this._attrs = vnode.attrs as IConfigFontAttrs;
    api.configField('home.customFont', 'common').subscribe(this.customFontHandler.bind(this));
  }

  private async customFontHandler(value: string) {
    if (!value) {
      this.customFont = null;
      document.fonts.clear();
    } else if (this.customFont !== value) {
      this.customFont = value;
      await this.renderCustomFont();
    }
  }

  public async renderCustomFont() {
    if (this.value == 'Custom' && this.customFont) {
      const font = new FontFace(this.value, `url("${this.customFont}")`);
      if (!document.fonts.has(font)) {
        const loadedFont = await font.load();
        document.fonts.add(loadedFont);
      }
      redraw();
    }
  }

  public fontChangeHandler(value: string) {
    if (this.value === value) {
      return;
    }

    if (value == '') {
      this._configValue = undefined;
    } else {
      this._configValue = value;
    }

    if (this._configValue === this._attrs.defaultValue) {
      this._configValue = null;
    }

    this.valueChangeHandler(this._configValue);
    this.renderCustomFont();
  }

  public template(attrs: IConfigFontAttrs) {
    const inputAttrs = { ...attrs };
    delete inputAttrs.configField;

    return ConfigTemplate.call(this, attrs);
  }
}
