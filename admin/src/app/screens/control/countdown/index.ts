import { ClassComponent, redraw, Vnode } from 'mithril';
import { IState } from '../../../../../../common/common';
import { api } from '../../../services/api';
import { template } from './template';

interface ICountDownAttrs {
  state: IState;
  ref: (value: CountDown) => void;
}

export const OFFSET_COUNTDOWN = 3000;

export class CountDown implements ClassComponent {
  private _state: IState;
  public value: number;
  public isStarted: boolean;
  public isDisabled: boolean;

  private _timer: number;
  private _initialValue: number;

  public oninit(vnode: Vnode<ICountDownAttrs, this>) {
    if (vnode.attrs.ref) {
      vnode.attrs.ref(this);
    }

    this.onbeforeupdate(vnode);

    this.isStarted = !!this._state?.timerTitleStarted;

    if (this.isStarted) {
      this.value = this._initialValue - Math.floor((api.time() - this._state.timerTitleStarted) * 0.001);
      this._timer = window.setTimeout(this.tick.bind(this), OFFSET_COUNTDOWN);
    } else {
      this.value = this._initialValue;
    }
  }

  public onbeforeupdate(vnode: Vnode<ICountDownAttrs, this>) {
    this._state = vnode.attrs.state;
    this._initialValue = this._state?.game?.titleTimer;

    this.isDisabled =
      this._state?.showQuestionIntro ||
      this._state?.showQuestion ||
      this._state?.showCorrectAnswer ||
      this._state?.showResult;

    if (this.isStarted && this.isDisabled) {
      this.stop();
    }
  }

  public startStopHandler() {
    if (!this.isStarted) {
      this.start();
    } else {
      this.stop();
    }
  }

  public async start(): Promise<void> {
    if (this.isStarted) {
      return;
    }

    this.isStarted = true;
    this.value = this._initialValue;
    this._timer = window.setTimeout(this.tick.bind(this), OFFSET_COUNTDOWN);
    await api.startTimerTitle();
  }

  public async stop(): Promise<void> {
    if (!this.isStarted) {
      return;
    }

    clearTimeout(this._timer);
    this.isStarted = false;
    this.value = this._initialValue;
    if (!this.isDisabled) {
      await api.stopTimerTitle();
    }
  }

  private tick(): void {
    this.value--;

    if (this.value > 0) {
      this._timer = window.setTimeout(this.tick.bind(this), 1000);
    } else {
      this.stop();
    }
    redraw();
  }

  public onremove() {
    clearTimeout(this._timer);
  }

  public view() {
    return template.call(this);
  }
}
