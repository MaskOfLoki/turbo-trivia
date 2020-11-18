import { ConfigScreen } from './index';
import styles from './module.scss';
import m from 'mithril';
import cn from 'classnames';

export function template(this: ConfigScreen) {
  return (
    <div class={styles.screen}>
      <div class={styles.header}>
        <div class={styles.title}>Turbo Trivia</div>
        <div class={styles.space}></div>
        <div class={styles.menuList}>
          {this.menus.map((menu) => (
            <button
              class={cn({ [styles.selected]: this.selectedMenu == menu })}
              onclick={() => (this.selectedMenu = menu)}
            >
              {menu.label}
            </button>
          ))}
        </div>
      </div>
      <div class={styles.divider}></div>
      <div class={styles.main}>
        {m(this.selectedMenu.component, {
          slot: this.slot,
          slots: this.project?.slots,
          saveConfig: this.saveConfigHandler.bind(this),
          changeSlot: this.changeSlotHandler.bind(this),
        })}
      </div>
    </div>
  );
}
