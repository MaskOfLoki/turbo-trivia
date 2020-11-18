import { ClassComponent, Vnode } from 'mithril';

import { template } from './template';

export interface IAnimatedTextAttrs {
  text: string;
  animation: 'zoomin' | 'zoomout' | 'fadein' | 'fadeinleft' | 'slideinleft' | 'bounceinup';
  duration: number;
  txtColor?: string;
  classNames?: string;
  letterDelay?: number;
  delay?: number;
  onAnimationEnd?: () => void;
}

export class AnimatedTextComponent implements ClassComponent<IAnimatedTextAttrs> {
  private _duration = 1000;
  private _letters: string[] = [];
  private _letterDelay = 0;
  private _delay = 0;

  public oninit(vnode: Vnode<IAnimatedTextAttrs>) {
    const { text, duration, letterDelay, delay, onAnimationEnd } = vnode.attrs;
    this._letters = (text || '').split('');
    this._duration = duration;
    this._letterDelay = letterDelay | 0;
    this._delay = delay | 0;

    setTimeout(() => {
      if (onAnimationEnd) {
        onAnimationEnd();
      }
    }, duration + this.letters.length * this._letterDelay);
  }

  public view(vnode: Vnode<IAnimatedTextAttrs>) {
    return template.call(this, vnode.attrs);
  }

  public get letters() {
    return this._letters;
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
}
