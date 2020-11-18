import { redraw, Vnode } from 'mithril';
import { IState, QuestionType } from '../../../../../../../common/common';
import { getMediaType } from '../../../../../../../common/utils';
import { isPreview } from '../../../../../../../common/utils/query';
import { ClassBaseComponent } from '../../../../components/class-base';
import { api } from '../../../../services/api';
import { template } from './template';

interface IAnswerCountDownAttrs {
  ref: (value: AnswerCountDown) => void;
}

const COUNTDOWN_OFFSET_DIFF_FROM_SERVER = 2;

export class AnswerCountDown extends ClassBaseComponent {
  public timerValue: number;
  private _questionIndex: number;
  private _timer: number;
  private _questionTimer = 0;
  private _isStartCountDown: boolean;
  private _questionStartTime: number;

  constructor() {
    super();
    this._subscriptions.push(api.state.subscribe(this.stateHandler.bind(this)));
  }

  public oninit(vnode: Vnode<IAnswerCountDownAttrs, this>) {
    if (vnode.attrs.ref) {
      vnode.attrs.ref(this);
    }
  }

  public view({ attrs }) {
    return template.call(this, attrs);
  }

  private stateHandler(value: IState) {
    if (!value.game || !value.showQuestion) {
      return;
    }

    this._questionTimer = value.game.questionTimer;

    const question = value.game.questions[value.questionIndex];

    if (getMediaType(question.file?.url) === 'audio' || getMediaType(question.file?.url) === 'video') {
      this._questionTimer = Math.floor(
        question.file.duration > this._questionTimer ? question.file.duration : this._questionTimer,
      );
    }

    if (this._questionIndex !== value.questionIndex) {
      this._questionIndex = value.questionIndex;
      this._questionStartTime = value.questionStartTime;

      if (
        (question.type === QuestionType.QUESTION_MULTI && !value.showCorrectAnswer) ||
        question.type === QuestionType.MEDIA
      ) {
        this.timerValue = Math.max(
          Math.floor(
            this._questionTimer + COUNTDOWN_OFFSET_DIFF_FROM_SERVER - (api.time() - this._questionStartTime) / 1000,
          ),
          0,
        );

        this.timerValue = this.timerValue > this._questionTimer ? this._questionTimer : this.timerValue;
        this._timer = window.setTimeout(this.tickHandler.bind(this), 1000);
      }
    }

    if (question.type === QuestionType.QUESTION_MULTI && value.showCorrectAnswer) {
      clearTimeout(this._timer);
    }

    redraw();
  }

  public startCountDown() {
    this._isStartCountDown = true;
    clearTimeout(this._timer);
    this._timer = window.setTimeout(this.tickHandler.bind(this), 1000);
  }

  public stopCountDown() {
    this._isStartCountDown = false;
  }

  private tickHandler(): void {
    if (isPreview()) {
      return;
    }

    if (this.timerValue <= 0 || !this._isStartCountDown) {
      return;
    }

    this.timerValue = Math.max(
      Math.floor(
        this._questionTimer + COUNTDOWN_OFFSET_DIFF_FROM_SERVER - (api.time() - this._questionStartTime) / 1000,
      ),
      0,
    );

    this.timerValue = this.timerValue > this._questionTimer ? this._questionTimer : this.timerValue;
    this._timer = window.setTimeout(this.tickHandler.bind(this), 1000);
    redraw();
  }

  public get percentage(): number {
    return 100 - Math.floor((this.timerValue * 100) / this._questionTimer);
  }

  public get isStartCountDown() {
    return this._isStartCountDown;
  }

  public onremove() {
    super.onremove();
    clearInterval(this._timer);
  }
}
