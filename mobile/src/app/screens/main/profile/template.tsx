import { ProfileScreen } from './index';
import m from 'mithril';
import { config } from '../../../services/ConfigService';
import { HighlightedInput } from '../../../components/highlighted-input';

export function template(this: ProfileScreen) {
  return (
    <div class={this.styles.screen}>
      <div
        class={this.styles.profileBar}
        style={{
          background: config.colors?.gamification,
        }}
      >
        <div
          class={this.styles.profileText}
          style={{
            color: config.colors?.text,
          }}
        >
          Profile
        </div>
      </div>
      <div class={this.styles.mainContent}>
        <div class={this.styles.inputRow}>
          <HighlightedInput
            value={this.userName}
            placeholder='User Name'
            tooltip='User Name'
            onchange={(v) => (this.userName = v)}
          />
        </div>
        <div class={this.styles.inputRow} id='groupPhone'>
          <HighlightedInput placeholder='Phone' tooltip='Phone' />
        </div>
        <button
          class={this.styles.saveBtn}
          style={{ background: config.colors?.button, color: config.colors.text }}
          onclick={this.saveHandler.bind(this)}
        >
          Save
        </button>
      </div>
    </div>
  );
}
