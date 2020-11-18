import { template } from './template';
import { ClassComponent, redraw, Vnode } from 'mithril';
import { fileService } from '../../services/FileService';
import Swal from 'sweetalert2';
import { isEmptyString } from '@gamechangerinteractive/xc-backend/utils';

const extensions = '.otf, .ttf';

const mimeToExtSpecial = {
  'svg+xml': 'svg',
  'font-sfnt': 'otf',
};

interface IFontUploadAttrs {
  value: string;
  onchange: (value?: string) => void;
  class: string;
  maxsize: number | string;
}

export class FontUpload implements ClassComponent<IFontUploadAttrs> {
  private _value: string;
  private _maxsize = 25;
  private _onchange: (value?: string) => void;
  private _class: string;

  public oninit(vnode: Vnode<IFontUploadAttrs>) {
    this._onchange = vnode.attrs.onchange;
    this.onbeforeupdate(vnode);
  }

  public onbeforeupdate({ attrs }: Vnode<IFontUploadAttrs>) {
    this._value = attrs.value;
    this._class = attrs.class || '';
    let maxsize = parseInt(attrs.maxsize as string);

    if (isNaN(maxsize) || maxsize <= 0) {
      maxsize = 25;
    }

    this._maxsize = maxsize;
  }

  public async clickHandler() {
    const file: File = await fileService.select(extensions);

    if (!file) {
      return;
    }

    const part = file.name.split('.').slice(-1)[0];

    if (!this.validMimeType(mimeToExtSpecial[part] ?? part)) {
      Swal.fire(`Can't upload that file type here. Valid extensions: ${extensions}`, '', 'warning');
      return;
    }

    if (file.size / 1024 / 1024 > this._maxsize) {
      Swal.fire(`Maximum file size is ${this._maxsize} MB`, '', 'warning');
      return;
    }

    this._value = await fileService.upload(file);

    if (this._onchange) {
      this._onchange(this._value);
    }

    redraw();
  }

  public buttonDeleteHandler(e: Event) {
    e.preventDefault();
    e.stopImmediatePropagation();

    if (isEmptyString(this.value)) {
      return;
    }

    if (this._onchange) {
      this._onchange();
    }
  }

  public view(vnode: Vnode<IFontUploadAttrs>) {
    return template.call(this, vnode.attrs);
  }

  public get value(): string {
    return this._value;
  }

  public get class(): string {
    return this._class;
  }

  private validMimeType(type: string): boolean {
    if (!type) {
      return;
    }

    type = type.toLowerCase();
    return extensions.includes(type);
  }
}
