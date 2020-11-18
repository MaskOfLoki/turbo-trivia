import { ClassComponent, Vnode } from 'mithril';
import { IAnimatedTextAttrs } from '../animated-text';

import { template } from './template';

export interface IAnimatedNumberAttrs extends IAnimatedTextAttrs {
  countUp?: boolean;
  useCommas?: boolean;
}

export class AnimatedNumberComponent implements ClassComponent<IAnimatedNumberAttrs> {
  private _duration = 1000;
  private _number = 0;
  private _numbers: string[] = [];
  private _delay = 0;
  private _letterDelay = 0;
  private _countUp = false;
  private _useCommas = false;

  public oninit(vnode: Vnode<IAnimatedNumberAttrs>) {
    const { text, duration, letterDelay, delay, countUp, useCommas, onAnimationEnd } = vnode.attrs;
    this._number = parseInt(text, 10);
    this._numbers = (useCommas ? numberWithCommas(parseInt(text, 10)) : text).split('');
    this._duration = duration;
    this._delay = delay | 0;
    this._letterDelay = letterDelay | 0;
    this._countUp = countUp || false;
    this._useCommas = useCommas || false;

    setTimeout(() => {
      if (onAnimationEnd) {
        onAnimationEnd();
      }
    }, duration);
  }

  public onbeforeupdate(vnode: Vnode<IAnimatedNumberAttrs>) {
    const { text, useCommas } = vnode.attrs;
    this._number = parseInt(text, 10);
    this._numbers = (useCommas ? numberWithCommas(parseInt(text, 10)) : text).split('');
  }

  public view(vnode: Vnode<IAnimatedNumberAttrs>) {
    return template.call(this, vnode.attrs);
  }

  public get number() {
    return this._number;
  }

  public get numbers(): string[] {
    return this._numbers;
  }

  public get delay() {
    return this._delay;
  }

  public get letterDelay() {
    return this._letterDelay;
  }

  public get duration() {
    return this._duration;
  }

  public get countUp(): boolean {
    return this._countUp;
  }

  public get useCommas(): boolean {
    return this._useCommas;
  }
}

export function numberWithCommas(x: number): string {
  if (x == null) {
    return '';
  }

  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
