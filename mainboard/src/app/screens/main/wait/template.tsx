import { WaitScreen } from './index';
import styles from './module.scss';
import m from 'mithril';
import { config } from '../../../services/ConfigService';

export function template(this: WaitScreen) {
  return (
    <div class={styles.screen}>
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
      <div class={styles.gameTitle} style={{ color: config.colors?.text }}>
        <div class={styles.title}>{config.game?.gameTitle}</div>
      </div>
      <div class={styles.welcomeText} style={{ color: config.colors?.text }}>
        <div class={styles.title}>{config.mainboard?.welcomeText}</div>
      </div>
    </div>
  );
}
