import { IConfig, IState, MainboardPreviewPage, QuestionType } from '../../../../common/common';
import { IWorkerAPIService } from './api/IWorkerAPIService';
import { isEmptyString, randInt, uuid } from '@gamechangerinteractive/xc-backend/utils';
import { getMainboardPreviewPage, getQueryParam } from '../../../../common/utils/query';
import { IGCLeader } from '@gamechangerinteractive/xc-backend';
import { route } from 'mithril';

const ROUTES = {
  [MainboardPreviewPage.WAIT]: '/wait',
  [MainboardPreviewPage.COUNTDOWN]: '/countdown',
  [MainboardPreviewPage.INTRO]: '/question-intro',
  [MainboardPreviewPage.SHOW]: '/question-show',
  [MainboardPreviewPage.RANK]: '/end',
};

class PreviewService implements IWorkerAPIService {
  private _id: number;
  private _state: IState = {};
  private _stateCallback: (value: IState) => void;
  private _configCallback: (value: IConfig) => void;
  private _previewPage: MainboardPreviewPage;

  private initPreviewRoute() {
    const previewRoute = ROUTES[this._previewPage];

    if (isEmptyString(previewRoute)) {
      return;
    }

    route.set(previewRoute);

    this._state = {
      sid: uuid(),
      startTime: Date.now(),
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
              url: '',
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

    if (this._previewPage === MainboardPreviewPage.COUNTDOWN) {
      this._state.timerTitleStarted = Date.now();
    } else if (this._previewPage === MainboardPreviewPage.INTRO) {
      this._state.questionIndex = 0;
      this._state.showQuestionIntro = true;
    } else if (this._previewPage === MainboardPreviewPage.SHOW) {
      this._state.questionIndex = 0;
      this._state.questionStartTime = Date.now();
      this._state.showQuestion = true;
    } else if (this._previewPage === MainboardPreviewPage.RANK) {
      this._state.questionIndex = 0;
      this._state.questionStartTime = Date.now();
      this._state.showQuestion = true;
      this._state.showCorrectAnswer = true;
      this._state.showResult = true;
    }
    this._stateCallback(this._state);
  }

  public async init(stateCallback: (value: IState) => void, configCallback: (value: IConfig) => void): Promise<void> {
    this._id = parseInt(getQueryParam('previewId'));

    this._previewPage = getMainboardPreviewPage();
    this._stateCallback = stateCallback;
    this._configCallback = configCallback;
    window.parent.postMessage(`previewReady${this._id}`, '*');
    window.addEventListener('message', this.messageHandler.bind(this));

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
    this._configCallback(config);
    requestAnimationFrame(this.initPreviewRoute.bind(this));
  }

  public login(id: string, secret?: string): Promise<boolean> {
    return Promise.resolve(true);
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

  public time(): Promise<number> {
    return Promise.resolve(Date.now());
  }
}

export const preview: PreviewService = new PreviewService();
