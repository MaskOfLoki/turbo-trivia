import { CircleCountDown, ICircleCountDownAttrs } from './index';
import styles from './module.scss';
import m, { Vnode } from 'mithril';
import cn from 'classnames';

export function template(
  this: CircleCountDown,
  { value, values, label, onchange, onchangeinput, disable }: ICircleCountDownAttrs,
) {
  const elementHeight = this.element?.clientHeight;

  return (
    <div class={cn(styles.control, { [styles.disable]: disable })}>
      <div
        class={styles.centerLabel}
        style={{
          width: `${Math.floor((elementHeight * 2.25) / 5)}px`,
          height: `${Math.floor((elementHeight * 2.25) / 5)}px`,
        }}
      >
        <div class={styles.label}>{label}</div>
        {onchangeinput && (
          <input
            type='number'
            class={styles.input}
            value={value}
            onblur={(e) => onchangeinput(parseInt(e.target.value))}
            placeholder='Custom'
          ></input>
        )}
      </div>
      {values.map((v, index) => {
        const radius = `${(elementHeight * 1.8) / 5}px`;
        const start = -90;
        const numberOfElements = values.length;
        const slice = 360 / numberOfElements;
        const rotate = slice * index + start;
        const rotateReverse = rotate * -1;
        return (
          <div
            class={cn(styles.countDownBtn, { [styles.selected]: value == v })}
            style={{
              width: `${Math.floor(elementHeight / 6.75)}px`,
              height: `${Math.floor(elementHeight / 6.75)}px`,
              transform: 'rotate(' + rotate + 'deg) translate(' + radius + ') rotate(' + rotateReverse + 'deg)',
            }}
            onclick={() => onchange(v)}
          >
            {v}
          </div>
        );
      })}
    </div>
  );
}
