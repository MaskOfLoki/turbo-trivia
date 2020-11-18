import { IWorkerAPIService } from './IWorkerAPIService';
import { expose } from 'comlink';
import { GAME_ID, IConfig, fillDefaultConfig, IState } from '../../../../../common/common';
import { isEmptyString } from '@gamechangerinteractive/xc-backend/utils';
import { IGCLeader, gcBackend } from '@gamechangerinteractive/xc-backend';
import ENV from '../../../../../common/utils/environment';

class WorkerAPIService implements IWorkerAPIService {
  private _state: IState;
  private _stateCallback: (value: IState) => void;
  private _configCallback: (value: IConfig) => void;

  public async login(cid: string, secret: string): Promise<boolean> {
    await gcBackend.init({
      cid,
      gid: GAME_ID,
      buildNum: BUILD_NUM,
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

    const isAdmin = await gcBackend.auth.isAdmin();

    if (isAdmin) {
      this.watchConfig();
      this.watchState();
    }

    return isAdmin;
  }

  private watchState() {
    let timerStateDelay;
    gcBackend.state.watch((value) => {
      clearTimeout(timerStateDelay);
      timerStateDelay = setTimeout(this.stateHandler.bind(this, value), 1000);
    }, '');
  }

  private watchConfig() {
    gcBackend.config.watch(this.configHandler.bind(this), 'common');
  }

  private configHandler(value: IConfig) {
    value = fillDefaultConfig(value);
    this._configCallback(value);
  }

  public init(stateCallback: (value: IState) => void, configCallback: (value: IConfig) => void) {
    this._stateCallback = stateCallback;
    this._configCallback = configCallback;
  }

  private stateHandler(value: IState) {
    this._state = value;
    this._stateCallback(value);
  }

  public getLeaders(leaderboard: string, limit?: number): Promise<IGCLeader[]> {
    if (isEmptyString(leaderboard)) {
      leaderboard = this._state.sid;
    }

    return gcBackend.leaderboards.getLeaders(leaderboard, limit);
  }

  public time(): Promise<number> {
    return gcBackend.time.now();
  }
}

expose(WorkerAPIService);
