import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

export function toPromise<T>(observable: Observable<T>): Promise<T> {
  return new Promise((resolve) => observable.pipe(first()).subscribe(resolve));
}

export const COUNTDOWN_OFFSET_DIFF_FROM_SERVER = 2;

export function hexToRgbA(hex: string, opacity: number): string {
  let c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split('');
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = '0x' + c.join('');
    return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + opacity + ')';
  }
  throw new Error('Bad Hex');
}

export function delay(value: number): Promise<void> {
  return new Promise<void>((resolve) => setTimeout(resolve, value));
}
