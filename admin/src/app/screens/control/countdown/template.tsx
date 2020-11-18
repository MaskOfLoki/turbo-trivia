import { CountDown } from './index';
import styles from './module.scss';
import m from 'mithril';
import cn from 'classnames';

export function template(this: CountDown) {
  return (
    <div class={styles.control}>
      <div class={styles.label}>
        TITLE COUNTDOWN: <div class={styles.value}>{this.value}</div>
      </div>
      <div
        class={cn(styles.startBtn, { [styles.disabled]: this.isDisabled })}
        onclick={this.startStopHandler.bind(this)}
      >
        {this.isStarted ? 'Stop' : 'Start'}
      </div>
    </div>
  );
}
