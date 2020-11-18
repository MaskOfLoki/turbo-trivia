import { Leaderboard } from './index';
import styles from './module.scss';
import m from 'mithril';
import { numberWithCommas } from '../../../../../../common/utils';
import cn from 'classnames';

export function template(this: Leaderboard) {
  return (
    <div class={styles.control}>
      <div class={styles.buttonWrapper}>
        <button
          class={cn(styles.leaderboardBtn, { [styles.selected]: this.isLeaderboardDisplay })}
          onclick={() => (this.isLeaderboardDisplay = true)}
        >
          LEADERBOARD
        </button>
        <button
          class={cn(styles.bannedBtn, { [styles.selected]: !this.isLeaderboardDisplay })}
          onclick={() => (this.isLeaderboardDisplay = false)}
        >
          BANNED
        </button>
      </div>
      <div class={styles.container}>
        {this.isLeaderboardDisplay && (
          <div class={styles.list}>
            {this.leaders.map((leader, index) => (
              <div class={styles.leaderItem}>
                <div class={styles.no}>{index + 1}</div>
                <div class={styles.name}>{leader.username}</div>
                <div class={styles.space}></div>
                <div class={styles.points}>{numberWithCommas(leader.points)}</div>
                <div class={styles.removeBtn} onclick={this.removeBtnHandler.bind(this, leader)}></div>
              </div>
            ))}
          </div>
        )}
        {!this.isLeaderboardDisplay && (
          <div class={styles.list}>
            {this.bannedUsers.map((bannedUser, index) => (
              <div class={styles.leaderItem}>
                <div class={styles.no}>{index + 1}</div>
                <div class={styles.name}>{bannedUser.username}</div>
                <div class={styles.space}></div>
                <div class={styles.points}></div>
                <div class={styles.unbanBtn} onclick={this.unbanUserHandler.bind(this, bannedUser)}></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
