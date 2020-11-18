import { expose } from 'comlink';

import firebase from 'firebase';
import { isEmptyString, randInt, uuid } from '@gamechangerinteractive/xc-backend/utils';
import { IWorkerAPIService } from './IWorkerAPIService';
import { gcBackend, IGCCoupon, IGCLeader, IGCUser } from '@gamechangerinteractive/xc-backend';
import {
  IState,
  IConfig,
  fillDefaultConfig,
  GAME_ID,
  IFinalAnswer,
  IPointsInfo,
  IHistoryItem,
  QuestionType,
  IUser,
} from '../../../../../common/common';
import ENV from '../../../../../common/utils/environment';
import { IGCAwardedCoupon } from '@gamechangerinteractive/xc-backend/types/IGCAwardedCoupon';
import { GCLeaderboards } from '@gamechangerinteractive/xc-backend/GCLeaderboards';
import { getMediaType, getWeeklyLeaderboard, isEmptyObject } from '../../../../../common/utils';
import { CouponType } from '@gamechangerinteractive/xc-backend/types/IGCCoupon';
import { COUNTDOWN_OFFSET_DIFF_FROM_SERVER, isXeo } from '../../utils';

class WorkerAPIService implements IWorkerAPIService {
  private _stateCallback: (value: IState) => void;
  private _configCallback: (value: IConfig) => void;
  private _pointsCallback: (value: IPointsInfo) => void;
  private _eliminatedCallback: (value: boolean) => void;
  private _couponCallback: (value: IGCAwardedCoupon) => void;
  private _state: IState = {};
  private _config: IConfig = fillDefaultConfig();
  private _verifyPhoneCode: (code: string) => Promise<IGCUser>;
  private _isEliminated: boolean;
  private _user: IGCUser;
  private _currentPoints: IPointsInfo = {
    overall: 0,
    overallRank: 0,
    current: 0,
    currentRank: 0,
  };
  private _awardedPoints = 0;
  private _nextActionTimeout: any = null;
  private _isXeo = false;
  private _xeoAwardUser: () => void;
  private _xeoLeaderInit: (leaderboard: string) => void;

  public async init(
    cid: string,
    stateCallback: (value: IState) => void,
    configCallback: (value: IConfig) => void,
    pointsCallback: (value: IPointsInfo) => void,
    eliminatedCallback: (value: boolean) => void,
    couponCallback: (value: IGCAwardedCoupon) => void,
    isXeo: boolean,
    xeoAwardUserCallback?: () => void,
    xeoLeaderinitCallback?: (leaderboard: string) => void,
  ) {
    await gcBackend.init({
      cid,
      gid: GAME_ID,
      buildNum: BUILD_NUM,
      env: ENV,
      pubnub: {
        // TODO: retrieve publishKey from admin-only firestore doc
        publishKey: 'pub-c-6a8ee5a3-f1dd-4c73-b3f9-377576cba026',
      },
    });
    this._stateCallback = stateCallback;
    this._configCallback = configCallback;
    this._pointsCallback = pointsCallback;
    this._eliminatedCallback = eliminatedCallback;
    this._couponCallback = couponCallback;
    this._isXeo = isXeo;
    this._xeoAwardUser = xeoAwardUserCallback;
    this._xeoLeaderInit = xeoLeaderinitCallback;
    gcBackend.config.watch(this.configHandler.bind(this), 'common');
  }

  public async isLoggedIn(uid?: string): Promise<IGCUser> {
    if (isEmptyString(uid)) {
      this._user = (await gcBackend.auth.isLoggedIn()) as IUser;
    } else {
      this._user = (await gcBackend.auth.loginUID(uid)) as IUser;
    }

    if (!this._user || isEmptyString(this._user?.phone)) {
      gcBackend.pubnub.init(`anonymous${uuid()}`);
      return;
    }

    this.initUser();
    return this._user;
  }

  public async loginAnonymously(): Promise<IUser> {
    this._user = (await gcBackend.auth.loginAnonymously()) as IUser;
    this.initUser();
    return this._user;
  }

  private configHandler(value: IConfig) {
    this._config = fillDefaultConfig(value);
    this._configCallback(this._config);
  }

  private async initUser(userName?: string, optIn?: boolean) {
    const update = {};

    if (!isEmptyString(userName)) {
      this._user.username = userName;
      update['username'] = this._user.username;
    }

    if (optIn != undefined && optIn != null) {
      update['optIn'] = optIn;
    }

    if (!isEmptyObject(update)) {
      await this.updateUser(update);
    }

    if (!isEmptyString(this._user?.username) && !isEmptyString(this._user?.phone)) {
      await this.initLeaderboard(GCLeaderboards.OVERALL, {
        username: this._user.username,
        phone: this._user.phone,
      });

      if (!this._isXeo) {
        await this.initLeaderboard(getWeeklyLeaderboard(), {
          username: this._user.username,
          phone: this._user.phone,
        });
      }
    }

    let timerStateDelay;
    gcBackend.state.watch((value) => {
      clearTimeout(timerStateDelay);
      timerStateDelay = setTimeout(this.stateHandler.bind(this, value), 1000);
    }, '');

    gcBackend.coupons.watch(this.couponHandler.bind(this));
    gcBackend.pubnub.subscribe(
      {
        channel: `${gcBackend.cid}-${GAME_ID}-default-presence`,
      },
      () => {
        // nothing to do here
        // we subscribe user to deticated channel to properly handle online users
      },
    );
    this.watchOverallPoints();
    this._pointsCallback(this._currentPoints);
  }

  private watchOverallPoints() {
    this.getOverallPoints();
    setInterval(this.getOverallPoints.bind(this), 30000);
  }

  private async getOverallPoints() {
    const entry = await this.getLeaderboardEntry(GCLeaderboards.OVERALL);
    this._currentPoints.overall = entry?.points || 0;
    this._currentPoints.overallRank = entry?.position || 0;
    this._pointsCallback(this._currentPoints);
  }

  private couponHandler(value: IGCAwardedCoupon) {
    this._couponCallback(value);
  }

  public async getOnlineUsers(): Promise<number> {
    try {
      const { totalOccupancy } = await gcBackend.pubnub.hereNow({
        channels: [`${gcBackend.cid}-${GAME_ID}-default-presence`],
      });

      return totalOccupancy;
    } catch {
      return 0;
    }
  }

  private async stateHandler(value: IState) {
    if (!isEmptyString(value.sid) && value.sid !== this._state?.sid) {
      this.initEvent(value.sid);
    }

    if (isEmptyString(value.sid)) {
      this._isEliminated = false;
      this._awardedPoints = 0;
      this._currentPoints.current = 0;
      this._currentPoints.currentRank = 0;
      this._eliminatedCallback(this._isEliminated);
      this._pointsCallback(this._currentPoints);
    } else if (value.sid && this._state?.sid !== value.sid) {
      const leader = (await this.getLeaderboardEntry(value.sid)) as IGCLeader;
      this._currentPoints.current = leader.points;
      this._currentPoints.currentRank = leader.position;
      this._pointsCallback(this._currentPoints);
      this.checkElimination(value);
    }

    const isFirstPlay = this._state?.sid !== value.sid;

    this._state = value;
    this._stateCallback(value);

    if (value.sid && value.isFreePlay && isFirstPlay) {
      clearTimeout(this._nextActionTimeout);
      this.checkFreePlayRoute();
    }
  }

  private async checkFreePlayRoute() {
    const state: IState = await this.getFreePlayState();
    if (!isEmptyString(state.sid) && this._state.sid === state.sid) {
      this._state = state;

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
    } else {
      this.driveTitleCountDown();
    }
  }

  private async driveTitleCountDown() {
    await this.showTitleTimerHandler();
    this._nextActionTimeout = setTimeout(
      this.driverShowQuestionIntro.bind(this),
      this._state.game.titleTimer * 1000 + COUNTDOWN_OFFSET_DIFF_FROM_SERVER * 1000,
    );
  }

  private async driverShowQuestionIntro() {
    await this.showNextQuestionHandler();
    this._nextActionTimeout = setTimeout(this.driverShowQuestion.bind(this), this._state.intermissionCountDown * 1000);
  }

  private async driverShowQuestion() {
    const questionTimer = await this.showNextQuestionHandler();
    this._nextActionTimeout = setTimeout(this.driverShowQuestionResult.bind(this), questionTimer * 1000 + 7.5 * 1000);
  }

  private driverShowQuestionResult() {
    const currentQuestion = this._state.game.questions[this._state.questionIndex];

    if (currentQuestion.type === QuestionType.QUESTION_MULTI) {
      this.showCorrectAnswerHandler();
      if (this.hasNextQuestion()) {
        this._nextActionTimeout = setTimeout(
          this.driverShowQuestionIntro.bind(this),
          this._state.revealCountDown * 1000,
        );
      } else {
        this._nextActionTimeout = setTimeout(this.driverShowResults.bind(this), this._state.revealCountDown * 1000);
      }
    } else if (currentQuestion.type === QuestionType.MEDIA) {
      if (this.hasNextQuestion()) {
        this._nextActionTimeout = setTimeout(this.driverShowQuestion.bind(this), 1000);
      } else {
        this._nextActionTimeout = setTimeout(this.driverShowResults.bind(this), 1000);
      }
    }
  }

  private driverShowResults() {
    this.showResultHandler();
    this._nextActionTimeout = setTimeout(this.driveAward.bind(this), 10000);
  }

  private async driveAward() {
    if (this._state.isAwarded) {
      return;
    }

    if (this._isXeo) {
      if (this._xeoAwardUser) {
        this._xeoAwardUser();
      }
    } else {
      const coupons: IGCCoupon[] = await gcBackend.coupons.getCoupons();

      const everyOneCoupon = coupons.find((coupon) => coupon.type === CouponType.EVERYONE && coupon.end >= new Date());

      if (everyOneCoupon) {
        await gcBackend.coupons.award(everyOneCoupon, this._state.sid, ...[this._user.uid]);
      }
    }

    this._state.isAwarded = true;
    this.saveFreePlayState();
    this._stateCallback(this._state);
  }

  private async showNextQuestionHandler() {
    if (this._state.questionIndex === null || this._state.questionIndex == undefined) {
      this._state.questionIndex = 0;
    }

    if (!this._state.showQuestionIntro && !this._state.showQuestion) {
      this.showQuestionIntroHandler();
      return;
    }

    if (this._state.showQuestion) {
      const indexOfNewQuestion = this._state.questionIndex + 1;

      if (indexOfNewQuestion < this._state.game.questions.length) {
        if (this._state.game.questions[this._state.questionIndex].type === QuestionType.MEDIA) {
          this._state.questionIndex = indexOfNewQuestion;
          this.showQuestionHandler();

          const question = this._state.game.questions[this._state.questionIndex];
          let questionTimer = this._state.game.questionTimer;

          if (getMediaType(question.file?.url) === 'audio' || getMediaType(question.file?.url) === 'video') {
            questionTimer = Math.floor(question.file.duration > questionTimer ? question.file.duration : questionTimer);
          }

          return questionTimer;
        } else {
          this._state.questionIndex = indexOfNewQuestion;
          this.showQuestionIntroHandler();
        }
      }

      return;
    }

    await this.showQuestionHandler();

    const question = this._state.game.questions[this._state.questionIndex];
    let questionTimer = this._state.game.questionTimer;

    if (getMediaType(question.file?.url) === 'audio' || getMediaType(question.file?.url) === 'video') {
      questionTimer = Math.floor(question.file.duration > questionTimer ? question.file.duration : questionTimer);
    }

    return questionTimer;
  }

  private async showTitleTimerHandler() {
    this._state.timerTitleStarted = (await this.time()) - COUNTDOWN_OFFSET_DIFF_FROM_SERVER * 1000;
    delete this._state.questionIndex;
    delete this._state.showQuestionIntro;
    delete this._state.showCorrectAnswer;
    delete this._state.showQuestion;

    this.saveFreePlayState();
    this._stateCallback(this._state);
  }

  private showQuestionIntroHandler() {
    this._state.showQuestionIntro = true;
    delete this._state.showQuestion;
    delete this._state.showCorrectAnswer;
    delete this._state.timerTitleStarted;

    this.saveFreePlayState();
    this._stateCallback(this._state);
  }

  private async showQuestionHandler() {
    this._state.showQuestion = true;
    this._state.questionStartTime = (await this.time()) - 1000;
    delete this._state.showQuestionIntro;
    delete this._state.showCorrectAnswer;
    delete this._state.timerTitleStarted;

    this.saveFreePlayState();
    this._stateCallback(this._state);
  }

  private showCorrectAnswerHandler() {
    this._state.showCorrectAnswer = true;
    this.saveFreePlayState();
    this._stateCallback(this._state);
  }

  private showResultHandler() {
    this._state.showResult = true;
    this.saveFreePlayState();
    this._stateCallback(this._state);
  }

  public async saveFreePlayState() {
    await gcBackend.redis.hset(
      `${gcBackend.gid}.${this._state.sid}.freeplaystates`,
      gcBackend.auth.uid,
      JSON.stringify(this._state),
    );
  }

  private async getFreePlayState() {
    const data: string = await gcBackend.redis.hget(
      `${gcBackend.gid}.${this._state.sid}.freeplaystates`,
      gcBackend.auth.uid,
    );

    let values = {};

    if (data) {
      values = JSON.parse(data);
    }

    return values;
  }

  private hasNextQuestion() {
    const index = this._state.questionIndex;
    return index < this._state.game.questions.length - 1 && index > -1;
  }

  private async checkElimination(value: IState) {
    const result = await this.getAllUserAnswers(value);
    this._isEliminated = result.some((item) => item.isEliminated);
    this._eliminatedCallback(this._isEliminated);
  }

  public async getAllUserAnswers(value?: IState): Promise<IFinalAnswer[]> {
    if (!value) {
      value = this._state;
    }

    const data = await Promise.all(
      value.game.questions.map((_, index) =>
        gcBackend.redis.hget(`${gcBackend.gid}.${value.sid}.${index}.answers`, `${gcBackend.auth.uid}`),
      ),
    );

    const result: IFinalAnswer[] = [];
    data.forEach((item: string, questionIndex) => {
      if (item) {
        const data = JSON.parse(item);
        result.push({
          questionIndex,
          answerIndex: data.answerIndex,
          isEliminated: !!data.isEliminated,
        });
      }
    });

    return result;
  }

  private async initEvent(sid: string) {
    if (!this._user) {
      return;
    }

    const result = await this.initLeaderboard(sid, {
      username: this._user.username,
      phone: this._user.phone,
    });

    if (result) {
      this._currentPoints.current = result.points;
      this._currentPoints.currentRank = result.position;
      this._pointsCallback(this._currentPoints);
    }

    if (!this._isXeo) {
      await this.initLeaderboard(getWeeklyLeaderboard(), {
        username: this._user.username,
        phone: this._user.phone,
      });
    }

    gcBackend.analytics.startSession(sid);
  }

  public async isUsernameAvailable(value: string): Promise<boolean> {
    return gcBackend.auth.isUsernameAvailable(value);
  }

  public async verifyPhone(phone: string): Promise<void> {
    if (GC_PRODUCTION) {
      this._verifyPhoneCode = (await gcBackend.auth.loginPhone(phone)) as (code: string) => Promise<IGCUser>;
    } else {
      this._verifyPhoneCode = async () => {
        const user = await gcBackend.auth.loginUID(`trivia-debuguser${phone}`);

        if (isEmptyString(user.phone)) {
          await gcBackend.firestore.doc(`/users/${user.uid}`).update({ phone });
          user.phone = phone;
          return user;
        } else {
          return user;
        }
      };
    }
  }

  public async verifyPhoneCode(code: string, userName: string, optIn: boolean): Promise<IGCUser> {
    this._user = await this._verifyPhoneCode(code);

    if (this._user) {
      this.initUser(userName, optIn);
    }

    return this._user;
  }

  public updateUser(update: Partial<IUser>): Promise<void> {
    for (const s in update) {
      if (update[s] === null) {
        update[s] = firebase.firestore.FieldValue.delete();
      }
    }

    if (!this._user) {
      this._user = update as IUser;
    } else {
      Object.assign(this._user, update);
    }

    return gcBackend.firestore.doc(`/users/${gcBackend.auth.uid}`).update(update);
  }

  public getLeaderboardEntry(leaderboard: string): Promise<IGCLeader> {
    if (isEmptyString(leaderboard)) {
      leaderboard = this._state.sid;
    }

    return gcBackend.leaderboards.get(leaderboard);
  }

  public getLeaders(leaderboard: string, limit?: number): Promise<IGCLeader[]> {
    if (isEmptyString(leaderboard)) {
      leaderboard = this._state.sid;
    }

    return gcBackend.leaderboards.getLeaders(leaderboard, limit);
  }

  public async addPoints(value: number): Promise<void> {
    if (this._user.uid === 'preview') {
      return;
    }

    if (this._isEliminated || value <= 0) {
      return;
    }

    if (!this.isRoundBased()) {
      await this.awardPoints(value);
      await this.addGameHistory();
      return;
    }

    this._awardedPoints += value;

    if (this._state.questionIndex === this._state.game.questions.length - 1) {
      await this.awardPoints(this._awardedPoints);
      await this.addGameHistory();
    }
  }

  public async addGameHistory(): Promise<void> {
    const entry: IGCLeader = await this.getLeaderboardEntry(this._state.sid);

    this._currentPoints.current = entry.points;
    this._currentPoints.currentRank = entry.position;

    this._pointsCallback(this._currentPoints);

    await gcBackend.redis.hset(
      `${gcBackend.gid}.histories.${gcBackend.auth.uid}`,
      this._state.sid,
      JSON.stringify({
        points: entry.points,
        position: entry.position,
        title: this._config.game?.gameTitle,
        date: this._state.startTime,
      }),
    );
  }

  public async getGameHistory(): Promise<IHistoryItem[]> {
    const result = await gcBackend.redis.hgetall(`${gcBackend.gid}.histories.${gcBackend.auth.uid}`);

    const history = [];
    if (result) {
      const values = Object.values(result);
      values.map((value: string) => {
        history.push(JSON.parse(value));
      });

      return history;
    } else {
      return history;
    }
  }

  public getAwardedCoupons(): Promise<IGCAwardedCoupon[]> {
    return gcBackend.coupons.getAwarded();
  }

  public async awardPoints(value: number): Promise<void> {
    if (this._isEliminated) {
      return;
    }

    const leaderboards = [this._state.sid, GCLeaderboards.OVERALL];

    if (this._config.feature?.multipleLeaderboards) {
      leaderboards.push(getWeeklyLeaderboard());
    }

    await gcBackend.leaderboards.add(value, leaderboards, {
      channel: '',
      username: this._user.username,
      phone: this._user.phone,
      email: '',
    });
  }

  public async answer(answerIndex: number): Promise<void> {
    const data: string = await gcBackend.redis.hget(
      `${gcBackend.gid}.${this._state.sid}.${this._state.questionIndex}.answers`,
      gcBackend.auth.uid,
    );

    let values = {};

    if (data) {
      values = JSON.parse(data);
    }

    values['answerIndex'] = answerIndex;

    await gcBackend.redis.hset(
      `${gcBackend.gid}.${this._state.sid}.${this._state.questionIndex}.answers`,
      gcBackend.auth.uid,
      JSON.stringify(values),
    );
  }

  public async answerIndex(): Promise<number> {
    const data: string = await gcBackend.redis.hget(
      `${gcBackend.gid}.${this._state.sid}.${this._state.questionIndex}.answers`,
      gcBackend.auth.uid,
    );

    let values = {};

    if (data) {
      values = JSON.parse(data);
    }

    return values['answerIndex'] >= 0 ? values['answerIndex'] : null;
  }

  public async eliminate(): Promise<void> {
    if (this.isRoundBased() && !this._isEliminated) {
      this._isEliminated = true;
      const data: string = await gcBackend.redis.hget(
        `${gcBackend.gid}.${this._state.sid}.${this._state.questionIndex}.answers`,
        gcBackend.auth.uid,
      );

      let values = {};

      if (data) {
        values = JSON.parse(data);
      }

      values['isEliminated'] = true;

      await gcBackend.redis.hset(
        `${gcBackend.gid}.${this._state.sid}.${this._state.questionIndex}.answers`,
        gcBackend.auth.uid,
        JSON.stringify(values),
      );

      this._eliminatedCallback(true);
    }
  }

  private async initLeaderboard(id: string, update) {
    if (this._isXeo) {
      this._xeoLeaderInit(id);
    }

    return gcBackend.leaderboards.init(id, update);
  }

  private isRoundBased(): boolean {
    return !!this._state?.game?.isRoundBased;
  }

  public markFrontgate(): void {
    gcBackend.analytics.frontGate();
  }

  public time(): Promise<number> {
    return gcBackend.time.now();
  }
}

expose(WorkerAPIService);
