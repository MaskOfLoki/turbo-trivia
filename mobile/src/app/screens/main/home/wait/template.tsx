import { WaitScreen } from './index';
import m from 'mithril';
import { config } from '../../../../services/ConfigService';

export function template(this: WaitScreen) {
  return (
    <div class={this.styles.screen}>
      <div
        class={this.styles.logo}
        style={{
          backgroundImage: config.home.images?.team ? `url(${config.home?.images?.team})` : '',
        }}
      ></div>
      <div class={this.styles.introText} style={{ color: config.colors?.text }}>
        {config.mobile?.introText}
      </div>
      <div class={this.styles.welcomeText} style={{ color: config.colors?.text }}>
        {config.mobile?.welcomeText}
      </div>
    </div>
  );
}
