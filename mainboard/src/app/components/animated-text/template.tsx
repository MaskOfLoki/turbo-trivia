import m from 'mithril';
import cn from 'classnames';

import { AnimatedTextComponent, IAnimatedTextAttrs } from './index';
import styles from './module.scss';

export function template(this: AnimatedTextComponent, { classNames, animation, txtColor }: IAnimatedTextAttrs) {
  return (
    <div
      class={cn(styles.animatedText, classNames, {
        [styles[animation]]: !this.letterDelay,
      })}
    >
      {this.letters.map((letter, i) => (
        <div
          class={cn(styles.animatedLetter, styles[animation])}
          style={{
            animationDelay: this.letterDelay * i + this.delay + 'ms',
            animationDuration: this.duration + 'ms',
            color: txtColor,
          }}
        >
          {letter}
        </div>
      ))}
    </div>
  );
}
