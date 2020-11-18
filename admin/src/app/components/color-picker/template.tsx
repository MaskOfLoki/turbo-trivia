import m from 'mithril';
import { ColorPicker } from './index';
import styles from './module.scss';

export function template(this: ColorPicker) {
  return (
    <div class={styles.colorPicker}>
      <div class={styles.picker} style={{ background: this.color }}>
        {this.candelete && (
          <div class={styles.clearColor} onclick={this.ondelete.bind(this)}>
            ×
          </div>
        )}
      </div>
      <div class={styles.editBtn} onclick={this.editBtnHandler.bind(this)}></div>
    </div>
  );
}
