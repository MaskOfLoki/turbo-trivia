import { Percentage } from './index';
import styles from './module.scss';
import m from 'mithril';
import { Slide } from '../../../components/slide';
import cn from 'classnames';

export function template(this: Percentage) {
  return (
    <div class={styles.control}>
      <div class={styles.percentageRow}>
        <Slide selected={this.isShowPercentage} onchange={this.showPercentageHandler.bind(this)}></Slide>
        <div class={styles.label}>SHOW PERCENTAGE</div>
      </div>
      <div class={styles.percentageBtn}>
        <button
          class={cn(styles.realBtn, { [styles.selected]: this.isRealPercentage })}
          onclick={this.realClickHandler.bind(this)}
        >
          Real
        </button>
        <button
          class={cn(styles.fakeBtn, { [styles.selected]: !this.isRealPercentage })}
          onclick={this.fakeClickHandler.bind(this)}
        >
          Fake
        </button>
      </div>
      <div class={styles.percentageValue}>
        {this.percentage.map((percentage) => (
          <div class={styles.percentageValueItem}>{percentage}%</div>
        ))}
      </div>
    </div>
  );
}
