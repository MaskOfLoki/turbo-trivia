import { api } from '../../../../services/api';
import { IState } from '../../../../../../../common/common';
import { config } from '../../../../services/ConfigService';
import { redraw } from 'mithril';
import { orientation } from '../../../../services/OrientationService';
import { template } from './template';
import { isPreview } from '../../../../../../../common/utils/query';
import { COUNTDOWN_OFFSET_DIFF_FROM_SERVER } from '../../../../utils';
import { BaseScreen } from '../../base';
import desktopStyles from './desktop.module.scss';
import mobileStyles from './mobile.module.scss';

export class CountDownScreen extends BaseScreen {
  public countDownMessage = '';

  private _value: number;
  private _timer: number;
  private _isStarted: boolean;
  private _timeStart: number;
  private _duration: number;

  constructor() {
    super();
    this._subscriptions.push(api.state.subscribe(this.stateHandler.bind(this)));
  }

  private stateHandler(value: IState) {
    if (!value.game || !value.timerTitleStarted || this._isStarted) {
      return;
    }

    this._isStarted = true;
    this._timeStart = value.timerTitleStarted;
    this._duration = value.game.titleTimer;

    this._value =
      this._duration + COUNTDOWN_OFFSET_DIFF_FROM_SERVER - Math.floor((api.time() - this._timeStart) * 0.001);
    this._value = this._value > this._duration ? this._duration : this._value;
    this.updateMessage();

    if (!isPreview()) {
      this._timer = window.setTimeout(this.tick.bind(this), 0);
    }
  }

  private updateMessage(): void {
    const fixedLength = config.misc?.fixedLengthNumbers;
    const rawCountdownTimer = config.misc?.rawCountdownTimer;

    if (this._value <= 0) {
      if (rawCountdownTimer && fixedLength) {
        this.countDownMessage = '000';
      } else if (rawCountdownTimer) {
        this.countDownMessage = '0';
      } else if (fixedLength) {
        this.countDownMessage = '0:00';
      } else {
        this.countDownMessage = '0:00';
      }

      redraw();
      return;
    }

    if (rawCountdownTimer) {
      this.countDownMessage = fixedLength ? this._value.toString().padStart(3, '0') : this._value.toString();
    } else {
      let mins: any = Math.floor(this._value / 60);
      const seconds = this._value - 60 * mins;
      if (fixedLength) {
        mins = mins.toString().padStart(2, '0');
      }
      this.countDownMessage = `${mins}:${seconds.toString().padStart(2, '0')}`;
    }
    redraw();
  }

  private tick() {
    this._value =
      this._duration + COUNTDOWN_OFFSET_DIFF_FROM_SERVER - Math.floor((api.time() - this._timeStart) * 0.001);
    this._value = this._value > this._duration ? this._duration : this._value;
    this.updateMessage();

    if (this._value > 0) {
      this._timer = window.setTimeout(this.tick.bind(this), 1000);
    }
  }

  public view() {
    return template.call(this);
  }

  public get styles() {
    if (orientation.isMobile) {
      return mobileStyles;
    } else {
      return desktopStyles;
    }
  }

  public get value(): number {
    return this._value;
  }

  public get duration(): number {
    return this._duration;
  }

  public onremove() {
    super.onremove();
    clearTimeout(this._timer);
  }
}
