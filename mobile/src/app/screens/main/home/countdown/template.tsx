import { CountDownScreen } from './index';
import m from 'mithril';
import { config } from '../../../../services/ConfigService';
import { CircleChart } from '../../../../components/circle-chart';
import { orientation } from '../../../../services/OrientationService';

export function template(this: CountDownScreen) {
  return (
    <div class={this.styles.screen}>
      <div
        class={this.styles.logo}
        style={{
          backgroundImage: config.home.images?.team ? `url(${config.home?.images?.team})` : '',
        }}
      />
      <div class={this.styles.countDownText} style={{ color: config.colors?.text }}>
        Countdown to game…
      </div>
      <div class={this.styles.circleChart}>
        <CircleChart
          label={this.countDownMessage}
          value={this.value / this.duration}
          fontSize={orientation.isMobile ? '10vmin' : '3.5vmax'}
        />
      </div>
    </div>
  );
}
