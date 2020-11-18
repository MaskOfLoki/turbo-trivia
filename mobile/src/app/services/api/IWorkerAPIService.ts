import { IGCLeader } from '@gamechangerinteractive/xc-backend';
import { IGCAwardedCoupon } from '@gamechangerinteractive/xc-backend/types/IGCAwardedCoupon';
import { IConfig, IState, IPointsInfo, IHistoryItem, IUser } from '../../../../../common/common';

export interface IWorkerAPIService {
  init(
    cid: string,
    stateCallback: (value: IState) => void,
    configCallback: (value: IConfig) => void,
    pointsCallback: (value: IPointsInfo) => void,
    eliminatedCallback: (value: boolean) => void,
    couponCallback: (value: IGCAwardedCoupon) => void,
    isXeo: boolean,
    xeoAwardUser?: () => Promise<void>,
    xeoLeaderinit?: (leaderboard: string) => void,
  ): Promise<void>;

  isLoggedIn(uid?: string): Promise<IUser>;

  loginAnonymously(): Promise<IUser>;

  markFrontgate(): void;

  updateUser(update: Partial<IUser>): Promise<void>;

  isUsernameAvailable(value: string): Promise<boolean>;

  verifyPhone(phone: string): Promise<void>;

  verifyPhoneCode(code: string, userName: string, optIn: boolean): Promise<IUser>;

  time(): Promise<number>;

  addPoints(value: number): Promise<void>;

  eliminate(): Promise<void>;

  answer(answerIndex: number): Promise<void>;

  answerIndex(): Promise<number>;

  getLeaders(leaderboard: string, limit?: number): Promise<IGCLeader[]>;

  getAwardedCoupons(): Promise<IGCAwardedCoupon[]>;

  getGameHistory(): Promise<IHistoryItem[]>;

  getOnlineUsers(): Promise<number>;
}
