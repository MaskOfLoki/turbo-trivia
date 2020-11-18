import { HighlightedInput, IHighlightedInputAttrs } from './index';
import m from 'mithril';
import styles from './module.scss';
import cn from 'classnames';
import { config } from '../../services/ConfigService';

export function template(this: HighlightedInput, attrs: IHighlightedInputAttrs) {
  return (
    <div class={styles.highlightedInput}>
      <input
        style={{
          borderBottomColor: config.colors?.text,
        }}
        class={cn(styles.input, attrs.class)}
        type={attrs.type}
        value={attrs.value}
        oninput={(e) => {
          if (attrs.onchange) {
            attrs.onchange(e.target.value);
          }
        }}
        placeholder={attrs.placeholder}
        onkeypress={(e: KeyboardEvent) => {
          if (e.key === 'Enter' && attrs.onenter) {
            attrs.onenter();
          }
        }}
      />
      <div
        class={styles.line}
        style={{
          boxShadow: `0 0 1vmin ${config.colors.primary}`,
        }}
      />
      <div class={styles.tooltip}>{attrs.tooltip}</div>
    </div>
  );
}
