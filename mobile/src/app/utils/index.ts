import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

const params: URLSearchParams = new URLSearchParams(location.search);

export function toPromise<T>(observable: Observable<T>): Promise<T> {
  return new Promise((resolve) => observable.pipe(first()).subscribe(resolve));
}

export const COUNTDOWN_OFFSET_DIFF_FROM_SERVER = 3;

export function formatDate(time: number) {
  const date = new Date(time);
  return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date
    .getDate()
    .toString()
    .padStart(2, '0')}/${date.getFullYear()}`;
}

export function delay(value: number): Promise<void> {
  return new Promise<void>((resolve) => setTimeout(resolve, value));
}

export function isXeo(): boolean {
  return params.has('xeo');
}

export const solidColor = (value) => ((value as any).steps ? (value as any).steps[0].color : value);

export const hexToRgbA = (hex, alpha = 1) => {
  let c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split('');
    if (c.length == 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = '0x' + c.join('');
    return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + `,${alpha})`;
  }
  return hex;
};
