import { ClassComponent, redraw, Vnode } from 'mithril';
import { IQuestion, IState, PercentageMode } from '../../../../../../common/common';
import { api } from '../../../services/api';
import { template } from './template';
import deepEqual from 'fast-deep-equal';

interface IPercentageAttrs {
  state: IState;
  ref: (value: Percentage) => void;
  showPercentageChange: () => void;
}

export class Percentage implements ClassComponent {
  private _realPercentage: number[] = [];
  private _fakePercentage: number[] = [];
  private _state: IState;
  private _questionIndex: number;
  private _question: IQuestion;
  private _unwatch: () => void;

  public isShowPercentage = false;
  public isRealPercentage = true;
  public percentage = [];
  public showPercentageChange: () => void;

  public oninit(vnode: Vnode<IPercentageAttrs, this>) {
    if (vnode.attrs.ref) {
      vnode.attrs.ref(this);
    }

    if (vnode.attrs.showPercentageChange) {
      this.showPercentageChange = vnode.attrs.showPercentageChange;
    }

    this.onbeforeupdate(vnode);
  }

  public onbeforeupdate(vnode: Vnode<IPercentageAttrs, this>) {
    if (!vnode.attrs.state?.game) {
      this._questionIndex = null;
      return;
    }

    if (deepEqual(this._state, vnode.attrs.state)) {
      return;
    }

    this._state = vnode.attrs.state;

    this.isShowPercentage = !!this._state.percentageMode;
    this.isRealPercentage = this._state.percentageMode != PercentageMode.FAKE;

    if (this._state?.questionIndex != null) {
      this._question = this._state?.game?.questions[this._state.questionIndex];
    }

    if (this._questionIndex !== this._state.questionIndex) {
      this._fakePercentage = this.createFakePercentage();
      this._questionIndex = this._state.questionIndex;
      this.initWatchPercentage();
    }
  }

  private async initWatchPercentage() {
    this.unwatch();
    // eslint-disable-next-line
    this._unwatch = await api.watchPercentages(this.percentageHandler.bind(this));
  }

  private percentageHandler(values: number[]): void {
    this._realPercentage = values;

    if (this.isRealPercentage) {
      this.percentage = this._realPercentage;
    } else {
      this.percentage = this._fakePercentage;
    }

    redraw();
  }

  private unwatch() {
    if (this._unwatch) {
      this._unwatch();
      this._unwatch = undefined;
    }
  }

  public showPercentageHandler(value) {
    this.isShowPercentage = value;
    if (this.isRealPercentage) {
      this.percentage = this._realPercentage;
    } else {
      this.percentage = this._fakePercentage;
    }

    if (this.showPercentageChange) {
      this.showPercentageChange();
    }
  }

  public realClickHandler() {
    this.isRealPercentage = true;
    this.percentage = this._realPercentage;
    if (this.showPercentageChange) {
      this.showPercentageChange();
    }
  }

  public fakeClickHandler() {
    this.isRealPercentage = false;
    this.percentage = this._fakePercentage;
    if (this.showPercentageChange) {
      this.showPercentageChange();
    }
  }

  private createFakePercentage(): number[] {
    if (this._question == null) {
      return [];
    }

    const result: number[] = [];
    const correctAnswerIndex: number = this._question.answers.findIndex((item) => item.correct);
    const incorrectAnswersIndexes: number[] = this._question.answers
      .filter((item) => !item.correct)
      .map((item) => this._question.answers.indexOf(item));

    // set percentage for correct answer between 60% and 90%
    let percentage: number = Math.round(Math.random() * 30) + 60;
    result[correctAnswerIndex] = percentage;
    const lastIndex = incorrectAnswersIndexes.length - 1;

    for (let i = 0; i < lastIndex; i++) {
      const t: number = Math.round(Math.random() * (100 - percentage));
      result[incorrectAnswersIndexes[i]] = t;
      percentage += t;
    }

    result[incorrectAnswersIndexes[lastIndex]] = 100 - percentage;
    return result;
  }

  public get realPercentage(): number[] {
    return this._realPercentage;
  }

  public get fakePercentage(): number[] {
    return this._fakePercentage;
  }

  public view() {
    return template.call(this);
  }

  public onremove() {
    this.unwatch();
  }
}
