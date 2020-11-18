import m from 'mithril';
import { EditPresetPopup, IEditPresetPopupAttrs, IEditPresetType } from '.';
import { Input } from '../../input';
import styles from './module.scss';

export function template(this: EditPresetPopup, { type }: IEditPresetPopupAttrs) {
  return (
    <div class={styles.presetPopup}>
      <div class={styles.header}>
        <div class={styles.title}>{type == IEditPresetType.NEW ? 'ADD NEW PRESET' : 'EDIT PRESET'}</div>
        <div class={styles.space}></div>
        <button class={styles.saveBtn} onclick={this.saveHandler.bind(this)}>
          SAVE
        </button>
        <div class={styles.closeBtn} onclick={this.close.bind(this, null)}></div>
      </div>
      <div class={styles.content}>
        <Input
          value={this.slot?.name}
          placeholder='Slot Name'
          oninput={(e) => (this.slot.name = e.target.value)}
        ></Input>
      </div>
    </div>
  );
}
