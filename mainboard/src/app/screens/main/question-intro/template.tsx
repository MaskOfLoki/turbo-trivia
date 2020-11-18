import { QuestionIntroScreen } from './index';
import styles from './module.scss';
import m from 'mithril';
import { config } from '../../../services/ConfigService';

export function template(this: QuestionIntroScreen) {
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
            Get Ready for Question
          </div>
        </div>

        <div
          class={styles.circleQuestion}
          style={{
            color: config.colors?.text,
            background: `radial-gradient(
              circle at center,
              ${config.colors.primary} 0%,
              rgba(1, 236, 252, 0) 65%,
              rgba(1, 236, 252, 0) 100%
            )`,
          }}
        >
          {this.questionNo}
        </div>
      </div>
    </div>
  );
}
