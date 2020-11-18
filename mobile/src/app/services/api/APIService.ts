import { proxy, wrap } from 'comlink';
import { redraw } from 'mithril';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { loading } from '../../../../../common/loading';
import { IWorkerAPIService } from './IWorkerAPIService';
import { IState, IConfig, IPointsInfo, IHistoryItem, MobilePreviewMode, IUser } from '../../../../../common/common';
import { getQueryParam, isPreview } from '../../../../../common/utils/query';
import { IGCLeader, IGCUser } from '@gamechangerinteractive/xc-backend';
import { IGCAwardedCoupon } from '@gamechangerinteractive/xc-backend/types/IGCAwardedCoupon';
import { PopupManager } from '../../../../../common/popups/PopupManager';
import { CouponPopup } from '../../components/coupon-popup';
import { XeoIntegration } from '../XeoIntegration';
import { isXeo } from '../../utils';
import { GCLeaderboards } from '@gamechangerinteractive/xc-backend/GCLeaderboards';

export class APIService extends XeoIntegration {
  private _worker: IWorkerAPIService;
  private _user: IGCUser;
  private _timeDif = 0;

  private readonly _stateSubject: Subject<IState> = new ReplaySubject(1);
  private readonly _configSubject: Subject<IConfig> = new ReplaySubject(1);
  private readonly _userSubject: Subject<IGCUser> = new ReplaySubject(1);
  private readonly _eliminatedSubject: Subject<boolean> = new ReplaySubject(1);
  private readonly _pointsSubject: Subject<IPointsInfo> = new ReplaySubject(1);

  public readonly state: Observable<IState> = this._stateSubject;
  public readonly config: Observable<IConfig> = this._configSubject;
  public readonly user: Observable<IGCUser> = this._userSubject;
  public readonly points: Observable<IPointsInfo> = this._pointsSubject;
  public readonly eliminated: Observable<boolean> = this._eliminatedSubject;
  private _state: IState;

  public async init(): Promise<void> {
    let clientId: string;

    if (!GC_PRODUCTION) {
      clientId = getQueryParam('gcClientId');
    } else {
      clientId = window.location.host.split('.')[0];
    }

    if (isPreview()) {
      const { preview } = await import('../PreviewService');
      this._worker = preview;
    } else {
      const WorkerClass = wrap(new Worker('./WorkerAPIService', { type: 'module' })) as any;
      this._worker = await loading.wrap(new WorkerClass());
    }

    await loading.wrap(
      this._worker.init(
        clientId,
        proxy((value) => this.stateHandler(value)),
        proxy((value) => this.configHandler(value)),
        proxy((value) => {
          this._pointsSubject.next(value);
          redraw();
        }),
        proxy((value) => {
          this._eliminatedSubject.next(value);
          redraw();
        }),
        proxy((value) => this.couponHandler(value)),
        isXeo(),
        proxy(() => this.sendXeoAwardUserRequest()),
        proxy((leaderboard: string) => {
          this.sendInitLeaderEntry(leaderboard);
        }),
      ),
    );
  }

  private couponHandler(coupon: IGCAwardedCoupon) {
    PopupManager.show(CouponPopup, { coupon });
  }

  private configHandler(value: IConfig) {
    this._configSubject.next(value);
    redraw();
  }

  private stateHandler(value: IState) {
    this._state = value;
    this._stateSubject.next(value);
    redraw();
  }

  public async isLoggedIn(): Promise<IGCUser> {
    this._user = await loading.wrap(this._worker.isLoggedIn(getQueryParam('uid')));

    this.initUser();
    return this._user;
  }

  private async timeSyncHandler() {
    const now = await this._worker.time();
    this._timeDif = Date.now() - now;
    setTimeout(this.timeSyncHandler.bind(this), 60000);
  }

  public markFrontgate(): void {
    this._worker.markFrontgate();
  }

  public verifyPhone(phone: string): Promise<void> {
    return loading.wrap(this._worker.verifyPhone(phone));
  }

  public async verifyPhoneCode(code: string, userName: string, optIn: boolean): Promise<IGCUser> {
    this._user = await loading.wrap(this._worker.verifyPhoneCode(code, userName, optIn));

    this.initUser();
    return this._user;
  }

  public async isUsernameAvailable(value: string): Promise<boolean> {
    if (this._user?.username === value) {
      return true;
    }

    return loading.wrap(this._worker.isUsernameAvailable(value));
  }

  public async loginAnonymously(): Promise<void> {
    this._user = await loading.wrap(this._worker.loginAnonymously());
    this.initUser();
  }

  private initUser() {
    if (!this._user) {
      return;
    }

    this._userSubject.next(this._user);
    this.timeSyncHandler();
  }

  public async updateUser(update: Partial<IUser>): Promise<void> {
    await loading.wrap(this._worker.updateUser(update));
    Object.assign(this._user, update);
    this._userSubject.next(this._user);
  }

  public getLeaders(leaderboard: string, limit?: number): Promise<IGCLeader[]> {
    if (isXeo()) {
      return this._worker.getLeaders(leaderboard, limit);
    } else {
      return this._worker.getLeaders(leaderboard, limit);
    }
  }

  public getOnlineUsers(): Promise<number> {
    return this._worker.getOnlineUsers();
  }

  public answer(answerIndex: number): Promise<void> {
    return this._worker.answer(answerIndex);
  }

  public answerIndex(): Promise<number> {
    return this._worker.answerIndex();
  }

  public async addPoints(value: number): Promise<void> {
    if (isXeo()) {
      const leaderboards = [this._state?.sid, GCLeaderboards.OVERALL];
      this.sendAddPoints(value, leaderboards);
      return this._worker.addPoints(value);
    } else {
      return this._worker.addPoints(value);
    }
  }

  public async eliminate(): Promise<void> {
    return this._worker.eliminate();
  }

  public time(): number {
    return Date.now() - this._timeDif;
  }

  public getGameHistory(): Promise<IHistoryItem[]> {
    return this._worker.getGameHistory();
  }

  public getAwardedCoupons(): Promise<IGCAwardedCoupon[]> {
    return loading.wrap(this._worker.getAwardedCoupons());
  }

  public get uid(): string {
    return this._user.uid;
  }
}
