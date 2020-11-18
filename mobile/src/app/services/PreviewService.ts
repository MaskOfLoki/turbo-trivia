import {
  IConfig,
  IState,
  fillDefaultConfig,
  IPointsInfo,
  IHistoryItem,
  MobilePreviewPage,
  QuestionType,
  IUser,
} from '../../../../common/common';
import { IWorkerAPIService } from './api/IWorkerAPIService';
import { isEmptyString, randInt, uuid } from '@gamechangerinteractive/xc-backend/utils';
import { route } from 'mithril';
import { loading } from '../../../../common/loading';
import { getPreviewPage, getQueryParam } from '../../../../common/utils/query';
import { IGCAwardedCoupon } from '@gamechangerinteractive/xc-backend/types/IGCAwardedCoupon';
import { IGCLeader, IGCUser } from '@gamechangerinteractive/xc-backend';

const ROUTES = {
  [MobilePreviewPage.FRONTGATE]: '/frontgate',
  [MobilePreviewPage.WAIT]: '/home',
  [MobilePreviewPage.COUNTDOWN]: '/home/countdown',
  [MobilePreviewPage.INTRO]: '/home/question-intro',
  [MobilePreviewPage.SHOW]: '/home/question-show',
  [MobilePreviewPage.RANK]: '/rank',
};

class PreviewService implements IWorkerAPIService {
  private _stateCallback: (value: IState) => void;
  private _configCallback: (value: IConfig) => void;
  private _state: IState = {};
  private _previewPage: MobilePreviewPage;
  private _id: number;

  private initPreviewRoute() {
    const previewRoute = ROUTES[this._previewPage];

    if (isEmptyString(previewRoute)) {
      return;
    }

    route.set(previewRoute);

    this._state = {
      sid: uuid(),
      startTime: Date.now(),
      isFreePlay: false,
      game: {
        titleTimer: 200,
        questionTimer: 200,
        gamePoints: 200,
        isRoundBased: false,
        questions: [
          {
            id: uuid(),
            text: 'QUESTION #1',
            file: {
              url: 'assets/images/question-preview.png',
            },
            type: QuestionType.QUESTION_MULTI,
            answers: [
              {
                id: uuid(),
                correct: true,
                text: 'Answer #1',
              },
              {
                id: uuid(),
                correct: false,
                text: 'Answer #2',
              },
              {
                id: uuid(),
                correct: false,
                text: 'Answer #3',
              },
            ],
          },
        ],
      },
    };

    if (this._previewPage === MobilePreviewPage.COUNTDOWN) {
      this._state.timerTitleStarted = Date.now();
    } else if (this._previewPage === MobilePreviewPage.INTRO) {
      this._state.questionIndex = 0;
      this._state.showQuestionIntro = true;
    } else if (this._previewPage === MobilePreviewPage.SHOW) {
      this._state.questionIndex = 0;
      this._state.questionStartTime = Date.now();
      this._state.showQuestion = true;
    } else if (this._previewPage === MobilePreviewPage.RANK) {
      this._state.questionIndex = 0;
      this._state.questionStartTime = Date.now();
      this._state.showQuestion = true;
      this._state.showCorrectAnswer = true;
      this._state.showResult = true;
    }

    this._stateCallback(this._state);
  }

  public init(
    cid: string,
    stateCallback: (value: IState) => void,
    configCallback: (value: IConfig) => void,
    pointsCallback: (value: IPointsInfo) => void,
    eliminatedCallback: (value: boolean) => void,
    couponCallback: (value: IGCAwardedCoupon) => void,
  ) {
    loading.disable();
    this._previewPage = getPreviewPage();
    this._id = parseInt(getQueryParam('previewId'));

    this._stateCallback = stateCallback;
    this._configCallback = configCallback;

    window.parent.postMessage(`previewReady${this._id}`, '*');
    window.addEventListener('message', this.messageHandler.bind(this));

    pointsCallback({
      overall: 0,
      overallRank: 10,
      current: 20,
      currentRank: 10,
    });

    return Promise.resolve();
  }

  private messageHandler(e: MessageEvent) {
    const data = e.data;

    if (isEmptyString(data.type) || data.id !== this._id) {
      return;
    }

    switch (data.type) {
      case 'updateConfig': {
        if (data.config) {
          this.configUpdate(data.config);
        }
        break;
      }
      default: {
        console.warn('PreviewService.messageHandler: unknown type', data.type);
        break;
      }
    }
  }

  private configUpdate(config: IConfig) {
    config = fillDefaultConfig(config);
    this._configCallback(config);
    requestAnimationFrame(this.initPreviewRoute.bind(this));
  }

  public isLoggedIn(): Promise<IGCUser> {
    requestAnimationFrame(this.initPreviewRoute.bind(this));

    return Promise.resolve({
      uid: 'preview',
      username: 'TestingFan001',
      phone: 'preview',
    });
  }

  public markFrontgate(): void {
    return;
  }

  public updateUser(update: Partial<IGCUser>) {
    return Promise.resolve();
  }

  public isUsernameAvailable(value: string): Promise<boolean> {
    return Promise.resolve(true);
  }

  public verifyPhone(phone: string) {
    return Promise.resolve();
  }

  public verifyPhoneCode(code: string): Promise<IGCUser> {
    return Promise.resolve(undefined);
  }

  public time(): Promise<number> {
    return Promise.resolve(Date.now());
  }

  public addPoints(value: number): Promise<void> {
    return Promise.resolve();
  }

  public eliminate(): Promise<void> {
    return Promise.resolve();
  }

  public answer(answerIndex: number): Promise<void> {
    return Promise.resolve();
  }

  public answerIndex(): Promise<number> {
    return Promise.resolve(0);
  }

  public getLeaders(leaderboard: string, limit?: number): Promise<IGCLeader[]> {
    const scores = Array.from({ length: limit }).map(() => randInt(10000, 100000));
    scores.sort((p1, p2) => p2 - p1);
    const result: IGCLeader[] = scores.map((points, position) => {
      return {
        uid: position.toString(),
        username: `TestingFan${position + 1}`,
        points,
        position,
      };
    });
    return Promise.resolve(result);
  }

  public loginAnonymously(): Promise<IUser> {
    return Promise.resolve({
      uid: 'preview',
      username: 'preview',
      phone: 'preview',
    });
  }

  public getAwardedCoupons(): Promise<IGCAwardedCoupon[]> {
    return Promise.resolve([]);
  }

  public getGameHistory(): Promise<IHistoryItem[]> {
    return Promise.resolve([]);
  }

  public getOnlineUsers(): Promise<number> {
    return Promise.resolve(3);
  }
}

export const preview: PreviewService = new PreviewService();
