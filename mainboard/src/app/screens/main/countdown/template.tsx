import { CountDownScreen } from './index';
import styles from './module.scss';
import m from 'mithril';
import { config } from '../../../services/ConfigService';
import { CircleChart } from './../../../components/circle-chart';

export function template(this: CountDownScreen) {
  return (
    <div class={styles.screen}>
      <div class={styles.layoutRow}>
        <div class={styles.layoutCol}>
          <div class={styles.logoRow}>
            <div
              class={styles.logo}
              style={{
                backgroundImage: config.home.images?.team ? `url(${config.home?.images?.team})` : '',
              }}
            ></div>
            {config.home.images?.team && config.home.images?.sponsor && (
              <div
                class={styles.logo2}
                style={{
                  backgroundImage: config.home.images?.sponsor ? `url(${config.home?.images?.sponsor})` : '',
                }}
              ></div>
            )}
          </div>
          <div class={styles.countDownText} style={{ color: config.colors?.text }}>
            Countdown to the Game
          </div>
        </div>
        <div class={styles.circleChart}>
          <CircleChart
            label={this.countDownMessage}
            value={this.value / this.duration}
            fontSize='6.5vmax'
            txtColor={config.colors.text}
            color={config.colors.primary}
          />
        </div>
      </div>
    </div>
  );
}
