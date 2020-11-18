import { IGCLeader } from '@gamechangerinteractive/xc-backend';
import { isEmptyString } from '@gamechangerinteractive/xc-backend/utils';
import { ClassComponent, redraw, route } from 'mithril';
import { Unsubscribable } from 'rxjs';
import Swal from 'sweetalert2';
import { IGameData, IQuestion, IState, PercentageMode, QuestionType } from '../../../../../common/common';
import { getMediaType } from '../../../../../common/utils';
import { api } from '../../services/api';
import { delayNotificationService } from '../../services/DelayNotificationService';
import { CountDown } from './countdown';
import { Leaderboard } from './leaderboard';
import { Percentage } from './percentage';
import { template } from './template';

export class ControlScreen implements ClassComponent {
  private _subscription: Unsubscribable;
  private _currentQuestionIndex: number = null;
  private _selectedQuestionIndex: number = null;
  private _state: IState;
  private _gameData: IGameData;
  public percentage: Percentage;
  public countDown: CountDown;
  public leaderboard: Leaderboard;
  private _nextActionTimeout: any = null;
  private _autoRunInfo: string;

  public oninit() {
    this._subscription = api.state('').subscribe(this.stateHandler.bind(this));
  }

  public stateHandler(state: IState) {
    if (isEmptyString(state.sid)) {
      route.set('/config');
      return;
    }

    if (state.showResult) {
      this.leaderboard?.stopWatching();
    }

    const isFirstPlay = this._state?.sid != state.sid;
    this._state = state;
    this._gameData = state.game;

    if (state.sid && isFirstPlay) {
      this.curQuestionChangeHandler(state.questionIndex ? state.questionIndex : 0);
    }

    if (this._selectedQuestionIndex === null) {
      this._selectedQuestionIndex = 0;
    }

    if (state.sid && state.isAutoRun && isFirstPlay) {
      clearTimeout(this._nextActionTimeout);
      this._autoRunInfo = '';
      this._nextActionTimeout = setTimeout(() => this.checkAutoDriveRoute(), 2000);
    }
  }

  private checkAutoDriveRoute() {
    if (this.state.questionIndex == null) {
      this._nextActionTimeout = setTimeout(this.driveTitleCountDown.bind(this), 1000);
      return;
    }

    if (!this._state.showQuestionIntro && !this._state.showQuestion) {
      this._nextActionTimeout = setTimeout(this.driverShowQuestionIntro.bind(this), 1000);
      return;
    }

    if (this._state.showQuestionIntro) {
      this._nextActionTimeout = setTimeout(this.driverShowQuestion.bind(this), 1000);
      return;
    }

    if (this._state.showQuestion && !this._state.showCorrectAnswer) {
      this._nextActionTimeout = setTimeout(this.driverShowQuestionResult.bind(this), 1000);
      return;
    }

    if (this._state.showQuestion && this._state.showCorrectAnswer) {
      if (this.hasNextQuestion()) {
        this._nextActionTimeout = setTimeout(this.driverShowQuestionIntro.bind(this), 1000);
      } else {
        this._nextActionTimeout = setTimeout(this.driverShowResults.bind(this), 1000);
      }
      return;
    }
  }

  public curQuestionChangeHandler(index: number): void {
    this._currentQuestionIndex = index;
    this._selectedQuestionIndex = this._currentQuestionIndex;
  }

  public selectedQuestionChangeHandler(index: number): void {
    this._selectedQuestionIndex = index;
    redraw();
  }

  public async nextQuestionHandler(): Promise<void> {
    if (this._currentQuestionIndex == null) {
      return;
    }

    if (!this.state.showQuestionIntro && !this.state.showQuestion) {
      await this.showQuestionIntroHandler(this.currentQuestionIndex);
      return;
    }

    if (this.state.showQuestion) {
      const indexOfNewQuestion = this._currentQuestionIndex + 1;

      if (indexOfNewQuestion < this.gameData.questions.length) {
        if (this.currentQuestion.type === QuestionType.MEDIA) {
          this.curQuestionChangeHandler(indexOfNewQuestion);
          await this.showQuestionHandler();
        } else {
          await this.showQuestionIntroHandler(indexOfNewQuestion);
          this.curQuestionChangeHandler(indexOfNewQuestion);
        }
      }
      return;
    }

    await this.showQuestionHandler();
  }

  public async buttonAwardHandler() {
    const winners = this.leaderboard.leaders.map((item) => item.uid);
    const result = await api.award(winners);

    if (!result.success) {
      Swal.fire({
        icon: 'error',
        title: 'Error while awarding coupons.',
        text: 'Details: ' + result.message,
      });
    } else {
      Swal.fire({
        title: 'Award Result',
        html: `Winners: ${result.winners}<br/>
          Losers: ${result.losers}<br/>`,
        allowOutsideClick: false,
      });
    }
  }

  public async showResultHandler() {
    await delayNotificationService.show('Populating leaderboard');
    await api.showResult();
  }

  public async revealQuestionHandler() {
    await this.showPercentageChangeHandler();
    await api.revealCorrectAnswer(this.currentQuestionIndex);
  }

  public async showPercentageChangeHandler() {
    if (this.percentage.isShowPercentage && this.percentage.isRealPercentage) {
      await api.showPercentage(PercentageMode.REAL, this.percentage.percentage);
    } else if (this.percentage.isShowPercentage && !this.percentage.isRealPercentage) {
      await api.showPercentage(PercentageMode.FAKE, this.percentage.percentage);
    } else if (this.state.percentage) {
      await api.showPercentage();
    }
  }

  private async showQuestionIntroHandler(questionIndex: number): Promise<void> {
    await api.showQuestionIntro(questionIndex);
  }

  private async showQuestionHandler(): Promise<void> {
    if (this.gameData.questions[this.currentQuestionIndex].type === QuestionType.QUESTION_MULTI) {
      await api.showMultiQuestion(this.currentQuestionIndex);
    } else {
      await api.showMediaQuestion(this.currentQuestionIndex);
    }
  }

  public hasNextQuestion(): boolean {
    const index = this.currentQuestionIndex;
    return index < this.gameData?.questions.length - 1 && index > -1;
  }

  private async driveTitleCountDown() {
    await api.startTimerTitle();
    this._autoRunInfo = 'Started title countdown.';
    this._nextActionTimeout = setTimeout(
      this.driverShowQuestionIntro.bind(this),
      this._state.game.titleTimer * 1000 + 1000,
    );
  }

  private async driverShowQuestionIntro() {
    await this.nextQuestionHandler();
    this._autoRunInfo = `Showing intro for '${this.currentQuestion.text}'`;
    this._nextActionTimeout = setTimeout(this.driverShowQuestion.bind(this), this._state.intermissionCountDown * 1000);
  }

  private async driverShowQuestion() {
    await this.nextQuestionHandler();
    this._autoRunInfo = `Showing question for '${this.currentQuestion.text}'`;
    let questionTimer = this._state.game.questionTimer;
    if (
      getMediaType(this.currentQuestion.file?.url) === 'audio' ||
      getMediaType(this.currentQuestion.file?.url) === 'video'
    ) {
      questionTimer = Math.floor(
        this.currentQuestion.file.duration > questionTimer ? this.currentQuestion.file.duration : questionTimer,
      );
    }
    this._nextActionTimeout = setTimeout(this.driverShowQuestionResult.bind(this), questionTimer * 1000 + 7.5 * 1000);
  }

  private async driverShowQuestionResult() {
    if (this.currentQuestion.type === QuestionType.QUESTION_MULTI) {
      await this.revealQuestionHandler();
      if (this.hasNextQuestion()) {
        this._nextActionTimeout = setTimeout(
          this.driverShowQuestionIntro.bind(this),
          this._state.revealCountDown * 1000,
        );
      } else {
        this._nextActionTimeout = setTimeout(this.driverShowResults.bind(this), this._state.revealCountDown * 1000);
      }
      this._autoRunInfo = `Showing question result for '${this.currentQuestion.text}'`;
    } else if (this.currentQuestion.type === QuestionType.MEDIA) {
      if (this.hasNextQuestion()) {
        this._nextActionTimeout = setTimeout(this.driverShowQuestion.bind(this), 1000);
      } else {
        this._nextActionTimeout = setTimeout(this.driverShowResults.bind(this), 1000);
      }
    }
  }

  private driverShowResults() {
    this.showResultHandler();
    this._autoRunInfo = `Showing game results`;
    this._nextActionTimeout = setTimeout(this.driveAward.bind(this), 10000);
  }

  private async driveAward() {
    if (this._state.isAwarded) {
      return;
    }

    await this.buttonAwardHandler();
  }

  public async resetHandler() {
    await api.resetActive();
  }

  public get autoRunInfo() {
    return this._autoRunInfo;
  }

  public get currentQuestion(): IQuestion {
    return this._state.game?.questions[this._currentQuestionIndex];
  }

  public get selectedQuestionIndex(): number {
    return this._selectedQuestionIndex;
  }

  public get currentQuestionIndex(): number {
    return this._currentQuestionIndex;
  }

  public get gameData(): IGameData {
    return this._gameData;
  }

  public get state(): IState {
    return this._state;
  }

  public view() {
    return template.call(this);
  }

  public onremove() {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }

    clearTimeout(this._nextActionTimeout);
  }
}
