import styles from './module.scss';
import m from 'mithril';
import { ICircleChartAttrs, CircleChart } from './index';
import cn from 'classnames';

export function template(this: CircleChart, attrs: ICircleChartAttrs) {
  return (
    <div class={cn(styles.control, attrs.class)}>
      <div class={styles.container} />
      <svg class={styles.svg}>
        <defs>
          <filter id='glow'>
            <feGaussianBlur stdDeviation='2.5' result='coloredBlur' />
            <feMerge>
              <feMergeNode in='coloredBlur' />
              <feMergeNode in='SourceGraphic' />
            </feMerge>
          </filter>
        </defs>
      </svg>
    </div>
  );
}
