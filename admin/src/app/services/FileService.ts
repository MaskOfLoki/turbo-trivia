import { uuid } from '@gamechangerinteractive/xc-backend/utils';
import { getMediaType } from '../../../../common/utils';
import { api } from './api';

class FileService {
  private _input: HTMLInputElement;

  public select(accept = '.png, .jpg, .jpeg, .svg'): Promise<File> {
    if (this._input) {
      this._input.remove();
    }

    this._input = document.createElement('input');
    this._input.type = 'file';
    this._input.style.position = 'absolute';
    this._input.style.opacity = '0';
    this._input.style['pointer-events'] = 'none';
    this._input.accept = accept;

    return new Promise<File>((resolve, reject) => {
      const handler = () => {
        this._input.removeEventListener('change', handler);

        if (this._input.files.length === 0) {
          reject('nothing was selected');
          return;
        }

        resolve(this._input.files[0]);
        this._input.value = null;
      };

      this._input.addEventListener('change', handler);
      this._input.click();
    });
  }

  public readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  }

  public upload(file: File): Promise<string> {
    const ref = uuid() + sanitizeFileName(file.name);
    return api.uploadFile(ref, file);
  }

  public getMediaDuration(url: string): Promise<number> {
    let media;
    if (getMediaType(url) == 'audio') {
      media = document.createElement('audio');
    } else if (getMediaType(url) == 'video') {
      media = document.createElement('video');
    }

    media.preload = 'metadata';
    media.src = url;

    return new Promise((resolve, reject) => {
      media.onloadedmetadata = function () {
        window.URL.revokeObjectURL(media.src);
        resolve(media.duration);
      };
    });
  }

  public delete(url: string): Promise<void> {
    return api.deleteFile(url);
  }
}

export const fileService: FileService = new FileService();

function sanitizeFileName(value: string): string {
  value = value.split(' ').join('');
  value = value.split('(').join('');
  value = value.split(')').join('');
  return value;
}
