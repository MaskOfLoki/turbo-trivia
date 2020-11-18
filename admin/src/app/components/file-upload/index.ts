import { template } from './template';
import { ClassComponent, redraw, Vnode } from 'mithril';
import { fileService } from '../../services/FileService';
import Swal from 'sweetalert2';
import { isEmptyString } from '@gamechangerinteractive/xc-backend/utils';

type UploadType = 'image' | 'multi';

const extensions = {
  image: '.png, .jpg, .jpeg, .svg, .gif',
  multi: '.png, .jpg, .jpeg, .svg, .gif, .mp4, .mp3',
};

const mimeToExtSpecial = {
  'svg+xml': 'svg',
};

interface IFileUploadAttrs {
  value: string;
  addButtonText: string;
  changeButtonText: string;
  resolutionText: string;
  type: UploadType;
  onchange: (value?: string) => void;
  class: string;
  maxsize: number | string;
}

export class FileUpload implements ClassComponent<IFileUploadAttrs> {
  private _value: string;
  private _type: UploadType;
  private _maxsize = 25;
  private _onchange: (value?: string) => void;
  private _class: string;
  public addButtonText: string;
  public changeButtonText: string;
  public resolutionText: string;

  public oninit(vnode: Vnode<IFileUploadAttrs>) {
    this._onchange = vnode.attrs.onchange;
    this._type = vnode.attrs.type || 'image';
    this.onbeforeupdate(vnode);
  }

  public onbeforeupdate({ attrs }: Vnode<IFileUploadAttrs>) {
    this._value = attrs.value;
    this._class = attrs.class || '';
    let maxsize = parseInt(attrs.maxsize as string);
    this.addButtonText = attrs.addButtonText;
    this.resolutionText = attrs.resolutionText;
    this.changeButtonText = attrs.changeButtonText;

    if (isNaN(maxsize) || maxsize <= 0) {
      maxsize = 25;
    }

    this._maxsize = maxsize;
  }

  public async clickHandler() {
    const file: File = await fileService.select(extensions[this._type]);

    if (!file) {
      return;
    }

    const part = file.name.split('.').slice(-1)[0];

    if (!this.validMimeType(mimeToExtSpecial[part] ?? part)) {
      Swal.fire(`Can't upload that file type here. Valid extensions: ${extensions[this._type]}`, '', 'warning');
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

  public view() {
    return template.call(this);
  }

  public get value(): string {
    return this._value;
  }

  public get class(): string {
    return this._class;
  }

  public get type(): UploadType {
    return this._type;
  }

  private validMimeType(type: string): boolean {
    if (!type) {
      return;
    }

    type = type.toLowerCase();
    return extensions[this._type].includes(type);
  }
}
