import { IGCCoupon, IGCLeader, IGCUser } from '@gamechangerinteractive/xc-backend';
import { IGameData, IPreset, PercentageMode } from '../../../../../common/common';
import { IAwardResult, IPaginatedLeadersRequest, IPaginatedLeadersResponse } from '../../utils';

export interface IWorkerAPIService {
  getPresets(type: string): Promise<IPreset[]>;

  savePreset(value: IPreset): Promise<void>;

  login(id: string, secret: string): Promise<boolean>;

  isSingleAdmin(): Promise<boolean>;

  publishGame(
    gameData: IGameData,
    isFreePlay: boolean,
    isAutoRun: boolean,
    revealCountDown: number,
    intermissionCountDown: number,
  ): Promise<void>;

  resetActive(): Promise<void>;

  revealCorrectAnswer(questionIndex: number): Promise<void>;

  showMultiQuestion(questionIndex: number): Promise<void>;

  showMediaQuestion(questionIndex: number): Promise<void>;

  showQuestionIntro(questionIndex: number): Promise<void>;

  startTimerTitle(): Promise<void>;

  stopTimerTitle(): Promise<void>;

  showPercentage(percentageMode?: PercentageMode, values?: number[]): Promise<void>;

  getOnlineUsers(): Promise<number>;

  getLeaders(leaderboard: string, limit?: number): Promise<IGCLeader[]>;

  award(winners?: string[], losers?: string[]): Promise<IAwardResult>;

  watchState<T>(callback: (value: T) => void, namespaces: string[]): Promise<VoidFunction>;

  watchConfig<T>(callback: (value: T) => void, namespaces: string[]): Promise<VoidFunction>;

  watchPercentages(callback: (values: number[]) => void): () => void;

  setConfigField<T>(field: string, setValue: T, namespace: string): Promise<void>;

  uploadFile(ref: string, value: File): Promise<string>;

  deleteFile(url: string): Promise<void>;

  banUser(user: IGCLeader): Promise<void>;

  unbanUser(user: IGCLeader): Promise<void>;

  showResult(): Promise<void>;

  getPaginatedLeaders(value: IPaginatedLeadersRequest): Promise<IPaginatedLeadersResponse>;

  time(): Promise<number>;
}
