import { IGCLeader } from '@gamechangerinteractive/xc-backend';
import { IConfig, IState } from '../../../../../common/common';

export interface IWorkerAPIService {
  init(stateCallback: (value: IState) => void, configCallback: (value: IConfig) => void): void;

  login(id: string, secret: string): Promise<boolean>;

  time(): Promise<number>;

  getLeaders(leaderboard: string, limit?: number): Promise<IGCLeader[]>;
}
