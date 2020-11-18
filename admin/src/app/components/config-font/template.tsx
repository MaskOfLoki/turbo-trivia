import { ConfigFont, IConfigFontAttrs, FONT_LIST } from './index';
import m from 'mithril';
import styles from './module.scss';
import { ConfigFontFileUpload } from '../config-font-file-upload';

export function ConfigTemplate(this: ConfigFont, attrs: IConfigFontAttrs) {
  const value = this.value || attrs.defaultValue;

  return (
    <div class={styles.configFont}>
      <div class={styles.label}>FONT TYPE:</div>
      <div class={styles.selectRow}>
        <select onchange={(e) => this.fontChangeHandler(e.target.value)}>
          {FONT_LIST.map((font) => (
            <option value={font.value} selected={value == font.value}>
              {font.name}
            </option>
          ))}
        </select>
        {value == 'Custom' && <ConfigFontFileUpload configField='home.customFont' type='font'></ConfigFontFileUpload>}
      </div>
      <div
        class={styles.fontExample}
        style={{
          'font-family': value,
        }}
      >
        The Quick Brown Fox Jumped Over The Lazy Dog
      </div>
    </div>
  );
}
