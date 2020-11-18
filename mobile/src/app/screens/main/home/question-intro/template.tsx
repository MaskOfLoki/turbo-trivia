import { QuestionIntroScreen } from './index';
import m from 'mithril';
import { config } from '../../../../services/ConfigService';

export function template(this: QuestionIntroScreen) {
  return (
    <div class={this.styles.screen}>
      <div
        class={this.styles.logo}
        style={{
          backgroundImage: config.home.images?.team ? `url(${config.home?.images?.team})` : '',
        }}
      ></div>
      <div class={this.styles.introText} style={{ color: config.colors?.text }}>
        Get Ready for
        <br />
        Question
      </div>
      <div class={this.styles.questionNo} style={{ color: config.colors?.text }}>
        {this.questionNo}
      </div>
    </div>
  );
}
