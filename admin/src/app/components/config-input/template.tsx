import { ConfigInput, IConfigInputAttrs } from './index';
import m from 'mithril';
import styles from './module.scss';
import { Input } from '../input';

export function InputTemplate(this: ConfigInput, attrs: IConfigInputAttrs) {
  const value = this.value || attrs.defaultValue;

  return (
    <div class={styles.configInput}>
      {m(Input, {
        value: value,
        candelete: value,
        ondelete: this.inputChangeHandler.bind(this),
        onblur: (e) => this.inputChangeHandler(e.target.value, true),
        ...attrs,
      })}
    </div>
  );
}
