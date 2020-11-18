import { IWorkerAPIService } from './IWorkerAPIService';
import { expose, proxy } from 'comlink';
import { isEmptyString, uuid } from '@gamechangerinteractive/xc-backend/utils';
import { gcBackend, IGCCoupon, IGCLeader, IGCUser } from '@gamechangerinteractive/xc-backend';
import {
  GAME_ID,
  IState,
  IConfig,
  IPreset,
  ISlot,
  IGameData,
  PercentageMode,
  QuestionType,
} from '../../../../../common/common';
import { removeNulls, deepSet } from '../../../../../common/utils';
import ENV from '../../../../../common/utils/environment';
import { CouponType } from '@gamechangerinteractive/xc-backend/types/IGCCoupon';
import { IAwardResult, IPaginatedLeadersRequest, IPaginatedLeadersResponse } from '../../utils';

class WorkerAPIService implements IWorkerAPIService {
  public async login(cid: string, secret: string): Promise<boolean> {
    await gcBackend.init({
      cid,
      gid: GAME_ID,
      buildNum: BUILD_NUM,
      pubnub: {
        // TODO: retrieve publishKey from admin-only firestore doc
        publishKey: 'pub-c-6a8ee5a3-f1dd-4c73-b3f9-377576cba026',
      },
      admin: true,
      firebaseAppName: 'admin',
      env: ENV,
    });

    if (isEmptyString(secret)) {
      const isLoggedIn = await gcBackend.auth.isLoggedIn();

      if (!isLoggedIn) {
        return false;
      }
    } else {
      await gcBackend.auth.loginUID(secret);
    }

    return gcBackend.auth.isAdmin();
  }

  public async isSingleAdmin(): Promise<boolean> {
    const channelGroup = `${gcBackend.cid}-${gcBackend.gid}-admin`;
    const { totalOccupancy } = await gcBackend.pubnub.hereNow({
      channelGroups: [channelGroup],
    });

    const channels = await gcBackend.pubnub.listChannels(channelGroup);

    if (channels.length > 2) {
      await gcBackend.pubnub.removeChannelsFromGroup(channels.slice(0, channels.length - 2), channelGroup);
    }

    const channel = `${channelGroup}-${Date.now()}`;
    await gcBackend.pubnub.addChannelsToGroup([channel], channelGroup);

    gcBackend.pubnub.subscribe(
      {
        channel,
        withPresence: true,
      },
      () => {
        // we subscribe to the channel just to track amount of users
      },
    );

    return totalOccupancy === 0;
  }

  public getLeaders(leaderboard: string, limit?: number): Promise<IGCLeader[]> {
    return gcBackend.leaderboards.getLeaders(leaderboard, limit);
  }

  public async getPresets(type: string): Promise<IPreset[]> {
    const snapshot = await gcBackend.firestore.collection(`games/${GAME_ID}/presets`).where('type', '==', type).get();

    return snapshot.docs.map((doc) => {
      const result: IPreset = doc.data() as IPreset;
      result.id = doc.id;
      return result;
    });
  }

  public async savePreset(value: IPreset): Promise<void> {
    removeNulls(value);
    const promises = [gcBackend.firestore.doc(`games/${GAME_ID}/presets/${value.id}`).set(value)];
    await Promise.all(promises);
  }

  public deletePreset(value: IPreset): Promise<void> {
    return gcBackend.firestore.doc(`games/${GAME_ID}/presets/${value.id}`).delete();
  }

  public async publishGame(
    game: IGameData,
    isFreePlay: boolean,
    isAutoRun: boolean,
    revealCountDown: number,
    intermissionCountDown: number,
  ): Promise<void> {
    const now = await this.time();

    const state: IState = {
      sid: uuid(),
      game,
      startTime: now,
      isFreePlay,
      isAutoRun,
    };

    if (isFreePlay || isAutoRun) {
      state.revealCountDown = revealCountDown;
      state.intermissionCountDown = intermissionCountDown;
    }

    return gcBackend.state.set(state, '');
  }

  public async showQuestionIntro(questionIndex: number): Promise<void> {
    const state = gcBackend.state.get<IState>('');

    state.questionIndex = questionIndex;
    state.showQuestionIntro = true;
    delete state.showQuestion;
    delete state.showCorrectAnswer;
    delete state.timerTitleStarted;

    return gcBackend.state.set(state, '');
  }

  public async showMultiQuestion(questionIndex: number): Promise<void> {
    const state = gcBackend.state.get<IState>('');

    state.questionIndex = questionIndex;
    state.showQuestion = true;
    state.questionStartTime = await this.time();
    delete state.showQuestionIntro;
    delete state.showCorrectAnswer;
    delete state.timerTitleStarted;

    return gcBackend.state.set(state, '');
  }

  public async showMediaQuestion(questionIndex: number): Promise<void> {
    const state = gcBackend.state.get<IState>('');

    state.questionIndex = questionIndex;
    state.showQuestion = true;
    state.showCorrectAnswer = true;
    state.questionStartTime = await this.time();
    delete state.showQuestionIntro;
    delete state.timerTitleStarted;

    return gcBackend.state.set(state, '');
  }

  public async revealCorrectAnswer(questionIndex: number): Promise<void> {
    const state = gcBackend.state.get<IState>('');

    state.questionIndex = questionIndex;
    state.showCorrectAnswer = true;

    return gcBackend.state.set(state, '');
  }

  public async startTimerTitle(): Promise<void> {
    const state = gcBackend.state.get<IState>('');

    state.timerTitleStarted = await this.time();
    delete state.questionIndex;
    delete state.showQuestionIntro;
    delete state.showCorrectAnswer;
    delete state.showQuestion;

    return gcBackend.state.set(state, '');
  }

  public async stopTimerTitle(): Promise<void> {
    const state = gcBackend.state.get<IState>('');

    delete state.timerTitleStarted;

    return gcBackend.state.set(state, '');
  }

  public showPercentage(percentageMode?: PercentageMode, values?: number[]): Promise<void> {
    const state = gcBackend.state.get<IState>('');

    if (percentageMode === PercentageMode.REAL) {
      state.percentageMode = PercentageMode.REAL;
      state.percentage = values;
    } else if (percentageMode === PercentageMode.FAKE) {
      state.percentageMode = PercentageMode.FAKE;
      state.percentage = values;
    } else {
      delete state.percentageMode;
      delete state.percentage;
    }

    return gcBackend.state.set(state, '');
  }

  public async resetActive(): Promise<void> {
    await gcBackend.state.set({}, '');
  }

  public async showResult(): Promise<void> {
    const state: IState = gcBackend.state.get<IState>('');

    gcBackend.analytics.addEntry({
      type: 'results-shown',
      admin: true,
    });

    state.showResult = true;

    return gcBackend.state.set(state, '');
  }

  public async award(winners?: string[], losers?: string[]): Promise<IAwardResult> {
    const state: IState = gcBackend.state.get<IState>('');

    if (state.isAwarded) {
      return { success: false, message: 'The game is already awarded.' };
    }

    const coupons: IGCCoupon[] = await gcBackend.coupons.getCoupons();

    const winnerCoupon = coupons.find((coupon) => coupon.type == CouponType.WINNER && coupon.end >= new Date());
    const loserCoupon = coupons.find((coupon) => coupon.type == CouponType.LOSER && coupon.end >= new Date());

    if (!winnerCoupon || !loserCoupon) {
      return { success: false, message: 'The winner coupon or loser coupon does not exist.' };
    }

    if (!winners) {
      const leaders: IGCLeader[] = await this.getLeaders(state.sid, 10);
      winners = leaders.map((item) => item.uid);
    }

    await gcBackend.coupons.award(winnerCoupon, state.sid, ...winners);

    if (!losers) {
      losers = await this.getOnlineUserIds();
      losers = losers.filter((uid) => !winners.includes(uid) && uid !== gcBackend.auth.uid);
    }

    await gcBackend.coupons.award(loserCoupon, state.sid, ...losers);

    state.isAwarded = true;

    await gcBackend.state.set(state, '');

    return { success: true, winners: winners.length, losers: losers.length };
  }

  public watchState<T extends IState>(callback: (value: T) => void, namespace: string[]): any {
    const unwatch = gcBackend.state.watch<T>((value) => {
      callback(value);
    }, ...namespace);
    return proxy(() => unwatch());
  }

  public watchConfig<T>(callback: (value: T) => void, namespace: string[]): any {
    const unwatch = gcBackend.config.watch<T>((value) => {
      callback(value);
    }, ...namespace);
    return proxy(() => unwatch());
  }

  public async setConfigField(field: string, value: any, namespace: string): Promise<void> {
    const config: IConfig = gcBackend.config.get(namespace);
    deepSet(field, config, value);
    return gcBackend.config.set(config, namespace);
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

  public async getOnlineUserIds() {
    try {
      const { channels } = await gcBackend.pubnub.hereNow({
        channels: [`${gcBackend.cid}-${GAME_ID}-default-presence`],
        includeUUIDs: true,
      });

      const occupants = Object.values(channels)[0]['occupants'];

      return occupants.map((occupant) => occupant['uuid']);
    } catch {
      return [];
    }
  }

  public watchPercentages(callback: (values: number[]) => void): () => void {
    let timer: number;
    let isStopped: boolean;

    const timerHandler = async () => {
      if (isStopped) {
        return;
      }

      const percentage = await this.getPercentage();

      if (isStopped) {
        return;
      }

      callback(percentage);
      timer = setTimeout(timerHandler, 2000) as any;
    };

    timerHandler();

    return proxy(() => {
      clearTimeout(timer);
      isStopped = true;
    });
  }

  private async getPercentage(): Promise<number[]> {
    const state = gcBackend.state.get<IState>('');

    if (isEmptyString(state?.sid)) {
      return [];
    }

    const result: number[] = state.game.questions[state.questionIndex]?.answers.map(() => 0);
    const data = await gcBackend.redis.hgetall(`${gcBackend.gid}.${state.sid}.${state.questionIndex}.answers`);

    if (!data) {
      return result;
    } else {
      const values = Object.values(data);

      values.map((value: string) => {
        const obj = JSON.parse(value);
        result[obj.answerIndex]++;
      });

      return result.map((item) => Math.round((100 * item) / values.length));
    }
  }

  public banUser(user: IGCLeader): Promise<void> {
    return gcBackend.leaderboards.banUser(user.uid);
  }

  public unbanUser(user: IGCLeader): Promise<void> {
    return gcBackend.leaderboards.unbanUser(user.uid);
  }

  public getBannedUsers(): Promise<IGCUser[]> {
    return gcBackend.leaderboards.getBannedUsers();
  }

  public getPaginatedLeaders(value: IPaginatedLeadersRequest): Promise<IPaginatedLeadersResponse> {
    return gcBackend.leaderboards.call('getPaginatedLeaders', value);
  }

  public uploadFile(ref: string, value: File): Promise<string> {
    return gcBackend.storage.put(ref, value);
  }

  public deleteFile(url: string): Promise<void> {
    return gcBackend.storage.delete(url);
  }

  public time(): Promise<number> {
    return gcBackend.time.now();
  }
}

expose(WorkerAPIService);
