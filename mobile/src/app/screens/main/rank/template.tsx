import { BASE_SCORE_DELAY, RankScreen, YOUR_SCORE_DELAY } from './index';
import m from 'mithril';
import { AnimatedTextComponent } from '../../../components/animated-text';
import { AnimatedNumberComponent } from '../../../components/animated-number';
import { orientation } from '../../../services/OrientationService';
import { config } from '../../../services/ConfigService';
import hmbAnimData from '../../../../assets/animation/Spark-Points.json';
import XCAnimateAE, { IXCAnimateConfig } from '../../../components/animate-ae';
import { hexToRgbA, solidColor } from '../../../utils';

export function template(this: RankScreen) {
  const hmbconfig: IXCAnimateConfig = {
    animation: {
      data: hmbAnimData,
      autoplay: false,
      loop: false,
    },
    play: true,
    timeout: 1500,
    id: this.styles.spark,
    width: 75,
    height: 62.5,
    onclick: null,
    onclickPlay: false,
    pingpong: false,
  };

  return (
    <div class={this.styles.screen}>
      <div
        class={this.styles.leaderboardBar}
        style={{
          background: config.colors.gamification,
        }}
      >
        <div
          class={this.styles.leaderboardText}
          style={{
            color: config.colors.text,
          }}
        >
          {orientation.isMobile ? 'Leaderboard' : 'Turbo Trivia Leaderboard'}
        </div>
      </div>
      <div
        class={this.styles.mainContent}
        style={{ background: hexToRgbA(solidColor(config.colors.gamification), 0.3) }}
      >
        <div class={this.styles.leaderboardList}>
          {this.players.map((player, index) => (
            <div class={this.styles.leaderboardItem}>
              <div
                class={this.styles.no}
                style={{
                  color: solidColor(config.colors.gamification),
                }}
              >
                {index + 1}
              </div>
              <div
                class={this.styles.userName}
                style={{
                  color: config.colors.text,
                }}
              >
                <AnimatedTextComponent
                  text={player.username}
                  animation={'slideinleft'}
                  duration={500}
                  delay={30 * index}
                ></AnimatedTextComponent>
              </div>
              <div class={this.styles.space}></div>
              <div
                class={this.styles.points}
                style={{
                  color: config.colors.text,
                }}
              >
                {player.username !== '' && (
                  <AnimatedNumberComponent
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
        <div class={this.styles.myRank}>
          <div
            class={this.styles.rankLabel}
            style={{
              color: config.colors.text,
            }}
          >
            YOUR RANK
          </div>
          <div class={this.styles.leaderboardItem}>
            <div
              class={this.styles.no}
              style={{
                color: solidColor(config.colors.gamification),
              }}
            >
              {this.rank + 1}
            </div>
            <div
              class={this.styles.userName}
              style={{
                color: config.colors.text,
              }}
            >
              <AnimatedTextComponent
                text={this.userName}
                animation={'bounceinup'}
                duration={500}
                delay={30 * this.players.length + YOUR_SCORE_DELAY}
                letterDelay={30}
              ></AnimatedTextComponent>
            </div>
            <div class={this.styles.space}></div>
            <div
              class={this.styles.points}
              style={{
                color: config.colors.text,
              }}
            >
              <XCAnimateAE config={hmbconfig} />
              <AnimatedNumberComponent
                text={this.points}
                animation={'fadein'}
                duration={500}
                delay={30 * this.players.length + BASE_SCORE_DELAY + YOUR_SCORE_DELAY}
                letterDelay={40}
                // countUp={true}
                useCommas={true}
              ></AnimatedNumberComponent>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
