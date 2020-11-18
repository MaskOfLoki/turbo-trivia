import { api } from '../../../../services/api';
import { IAnswer, IQuestion, IState, IMediaTimeLineInfo } from '../../../../../../../common/common';
import { AnswerCountDown } from './answer-countdown';
import deepEqual from 'fast-deep-equal';
import { redraw, VnodeDOM } from 'mithril';
import { mobile } from './mobile.template';
import { desktop } from './desktop.template';
import { orientation } from '../../../../services/OrientationService';
import { isEmptyString } from '@gamechangerinteractive/xc-backend/utils';
import { BaseScreen } from '../../base';
import { delay } from '../../../../utils';

import mobileStyles from './mobile.module.scss';
import desktopStyles from './desktop.module.scss';

export class QuestionShowScreen extends BaseScreen {
  public question: IQuestion;
  public showCorrect: boolean;
  public selectedAnswer: IAnswer;
  public submittedAnswer: IAnswer;
  public percentage: number[];
  public answerCountDown: AnswerCountDown;
  public firstRender = false;
  private _state: IState;
  private _points = 0;

  constructor() {
    super();
    this._subscriptions.push(api.state.subscribe(this.stateHandler.bind(this)));
  }

  public oncreate(vnode: VnodeDOM) {
    super.oncreate(vnode);
    delay(1).then(this.scaleAnswers.bind(this));
  }

  private scaleAnswers() {
    const styles = orientation.isMobile ? mobileStyles : desktopStyles;

    const answers = this._element.querySelectorAll(`.${styles.answerItem}`);
    answers.forEach((answer) => answer.classList.add(styles.display));
    this.firstRender = true;
  }

  private async stateHandler(value: IState) {
    if (isEmptyString(value.sid) || !value.showQuestion) {
      return;
    }

    if (!this._state || this._state.sid !== value.sid || this._state.questionIndex !== value.questionIndex) {
      this.question = value.game.questions[value.questionIndex];

      if (this.answerCountDown) {
        this.answerCountDown.startCountDown();
      }
    }

    if (!this._state || this._state.sid !== value.sid) {
      const answerIndex = await api.answerIndex();

      if (answerIndex >= 0) {
        this.submittedAnswer = this.question?.answers[answerIndex];
        this.selectedAnswer = this.submittedAnswer;
        redraw();
      }
    }

    if ((!this._state || !this._state.showCorrectAnswer) && value.showCorrectAnswer) {
      this.revealHandler();
    }

    this.showCorrect = value.showCorrectAnswer;

    this._state = value;
    this.updatePercentage();
  }

  public onLoadAnswerCountDown(answerCountDown: AnswerCountDown) {
    this.answerCountDown = answerCountDown;
    this.answerCountDown.startCountDown();
  }

  public answerSelectHandler(answer: IAnswer) {
    if (
      this.showCorrect ||
      this.submittedAnswer ||
      this.answerCountDown?.pointsValue <= 0 ||
      this.selectedAnswer === answer
    ) {
      return;
    }

    this._points = this.answerCountDown?.pointsValue;
    this.selectedAnswer = answer;
  }

  public async onSubmitHandler() {
    if (
      !this.showCorrect &&
      this.answerCountDown.pointsValue > 0 &&
      this.selectedAnswer &&
      this.selectedAnswer != this.submittedAnswer
    ) {
      this.submittedAnswer = this.selectedAnswer;
      await api.answer(this.question.answers.indexOf(this.submittedAnswer));
    }
  }

  private updatePercentage(): void {
    if (!this._state.percentage || this._state.percentage.length === 0) {
      this.percentage = null;
      return;
    }

    if (deepEqual(this.percentage, this._state.percentage)) {
      return;
    }

    this.percentage = this._state.percentage.map((item) => Math.floor(item));
    redraw();
  }

  private async revealHandler() {
    redraw();

    if (this.isAnswerCorrect()) {
      await api.addPoints(this._points);
    } else {
      await api.eliminate();
    }
  }

  public get state(): IState {
    return this._state;
  }

  private isAnswerCorrect(): boolean {
    return this.selectedAnswer ? this.selectedAnswer.correct : false;
  }

  public get points(): number {
    return this._points;
  }

  public view() {
    if (orientation.isMobile) {
      return mobile.call(this);
    } else {
      return desktop.call(this);
    }
  }
}
