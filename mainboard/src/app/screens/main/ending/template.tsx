import { BASE_SCORE_DELAY, EndingScreen } from './index';
import styles from './module.scss';
import m from 'mithril';
import { AnimatedTextComponent } from '../../../components/animated-text';
import { AnimatedNumberComponent } from '../../../components/animated-number';
import { config } from '../../../services/ConfigService';
import { hexToRgbA } from '../../../utils';

export function template(this: EndingScreen) {
  return (
    <div class={styles.screen}>
      <div class={styles.leaderboardBar} style={{ background: config.colors.gamification }}>
        <div class={styles.leaderboardText}>Turbo Trivia Leaderboard</div>
      </div>
      <div class={styles.mainContent} style={{ background: hexToRgbA(config.colors.gamification.toString(), 0.3) }}>
        <div class={styles.leaderboardList}>
          {this.players.map((player, index) => (
            <div class={styles.leaderboardItem}>
              <div class={styles.no} style={{ color: config.colors.gamification }}>
                {index + 1}
              </div>
              <div class={styles.userName}>
                <AnimatedTextComponent
                  txtColor={config.colors.text}
                  text={player.username}
                  animation={'slideinleft'}
                  duration={500}
                  delay={30 * index}
                ></AnimatedTextComponent>
              </div>
              <div class={styles.space}></div>
              <div class={styles.points}>
                {player.username !== '' && (
                  <AnimatedNumberComponent
                    txtColor={config.colors.text}
                    text={player.points}
                    animation={'fadein'}
                    duration={500}
                    delay={30 * index + BASE_SCORE_DELAY}
                    letterDelay={40}
                    // countUp={true}
                    useCommas={true}
                  ></AnimatedNumberComponent>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
