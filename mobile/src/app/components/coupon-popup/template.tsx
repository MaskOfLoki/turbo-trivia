import { CouponPopup, ICouponPopupAttrs } from './index';
import styles from './module.scss';
import m from 'mithril';
import { AnimatedTextComponent } from '../../components/animated-text';

export function template(this: CouponPopup, { coupon }: ICouponPopupAttrs) {
  return (
    <div class={styles.popup} onclick={this.close.bind(this)}>
      <div id='smoke' class={styles.smoke} style={{ transform: `scale(${this.smokeRatio})` }} />
      <AnimatedTextComponent
        classNames={styles.message}
        text='You win!'
        animation='zoomin'
        letterDelay={75}
        delay={0}
      />
      <div
        class={styles.image}
        style={{
          backgroundImage: `url(${coupon.image})`,
        }}
      />
      <div className={styles.tapText}>Tap to Continue</div>
      <canvas id='confetti' class={styles.confetti}></canvas>
    </div>
  );
}
