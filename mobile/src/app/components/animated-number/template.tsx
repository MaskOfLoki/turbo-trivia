import m from 'mithril';
import cn from 'classnames';

import { AnimatedNumberComponent, IAnimatedNumberAttrs } from './index';
import styles from './module.scss';
import { XCCountUp } from '../count-up';

export function template(this: AnimatedNumberComponent, { classNames, animation }: IAnimatedNumberAttrs) {
  return (
    <div
      class={cn(styles.animatedNumber, classNames, {
        [styles[animation]]: !this.letterDelay,
      })}
    >
      {this.countUp && (
        <div
          class={cn(styles[animation])}
          style={{ animationDelay: this.delay + 'ms', animationDuration: this.duration + 'ms' }}
        >
          <XCCountUp
            startValue={0}
            endValue={this.number}
            duration={this.duration / 100}
            separator={this.useCommas ? ',' : ''}
            useEasing={true}
            start={true}
          ></XCCountUp>
        </div>
      )}
      {!this.countUp &&
        this.numbers.map((number, i) => (
          <div
            class={cn(styles.animatedDigit, { [styles[animation]]: this.letterDelay })}
            style={{
              animationDelay: this.letterDelay * i + this.delay + 'ms',
              animationDuration: this.duration + 'ms',
            }}
          >
            {number}
          </div>
        ))}
    </div>
  );
}
