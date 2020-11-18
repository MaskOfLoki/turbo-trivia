import { ConfigTextArea, IConfigTextAreaAttrs } from './index';
import m from 'mithril';
import styles from './module.scss';
import { TextArea } from '../textarea';

export function TextAreaTemplate(this: ConfigTextArea, attrs: IConfigTextAreaAttrs) {
  const value = this.value || attrs.defaultValue;

  return (
    <div class={styles.configTextArea}>
      {m(TextArea, {
        value: value,
        candelete: value,
        ondelete: this.inputChangeHandler.bind(this),
        onblur: (e) => this.inputChangeHandler(e.target.value, true),
        ...attrs,
      })}
    </div>
  );
}
