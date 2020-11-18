import { PresetSelect } from './index';
import m from 'mithril';
import styles from './module.scss';

export function template(this: PresetSelect) {
  return (
    <div class={styles.control}>
      <select class={styles.presetSelect} onchange={(e) => this.slotChangeHandler(e.target.value)}>
        {this.slots?.map((slot) => (
          <option value={slot.id} selected={slot.id == this.slot?.id}>
            {slot.name ? slot.name : 'DEFAULT'}
          </option>
        ))}
      </select>
      {!this.disableEdit && (
        <button class={styles.presetAddBtn} onclick={this.addPresetHandler.bind(this)}>
          ADD
        </button>
      )}
      {!this.disableEdit && this.slot && this.slot?.id !== 'default' && (
        <button class={styles.presetDeleteBtn} onclick={this.deletePresetHandler.bind(this)}>
          DELETE
        </button>
      )}
    </div>
  );
}
