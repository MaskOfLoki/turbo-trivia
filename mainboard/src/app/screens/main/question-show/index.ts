import { template } from './template';
import { ClassBaseComponent } from '../../../components/class-base';
import { api } from '../../../services/api';
import { IQuestion, IState } from '../../../../../../common/common';
import { AnswerCountDown } from './answer-countdown';
import deepEqual from 'fast-deep-equal';
import { redraw, VnodeDOM } from 'mithril';
import styles from './module.scss';
import { delay } from './../../../utils';

export class QuestionShowScreen extends ClassBaseComponent {
  public question: IQuestion;
  public showCorrect: boolean;
  public percentage: number[];
  public answerCountDown: AnswerCountDown;
  private _state: IState;
  public firstRender = false;

  constructor() {
    super();
    this._subscriptions.push(api.state.subscribe(this.stateHandler.bind(this)));
  }

  public oncreate(vnode: VnodeDOM) {
    super.oncreate(vnode);
    delay(1).then(this.scaleAnswers.bind(this));
  }

  private scaleAnswers() {
    const answers = this._element.querySelectorAll(`.${styles.answerItem}`);
    answers.forEach((answer) => answer.classList.add(styles.display));
    this.firstRender = true;
  }

  private stateHandler(value: IState) {
    if (!value.game || !value.showQuestion) {
      return;
    }

    if (!this._state || this._state.sid !== value.sid || this._state.questionIndex !== value.questionIndex) {
      this.question = value.game.questions[value.questionIndex];

      if (this.answerCountDown) {
        this.answerCountDown.startCountDown();
      }
    }

    if ((!this._state || !this._state.showCorrectAnswer) && value.showCorrectAnswer) {
      this.revealHandler();
    }

    this._state = value;
    this.updatePercentage();
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

  private revealHandler() {
    this.showCorrect = true;
    redraw();
  }

  public get state(): IState {
    return this._state;
  }

  public onLoadQuestionHandler() {
    redraw();
  }

  public onLoadAnswerCountDown(answerCountDown: AnswerCountDown) {
    this.answerCountDown = answerCountDown;
    this.answerCountDown.startCountDown();
  }

  public view() {
    return template.call(this);
  }
}
