import { UserCount } from './index';
import styles from './module.scss';
import m from 'mithril';
import { CountUp } from '../../../../../../common/utils/CountUp';

export function template(this: UserCount) {
  return (
    <div class={styles.control}>
      <CountUp value={this.userCount}>
        <div class={styles.userCountValue}></div>
      </CountUp>
    </div>
  );
}
