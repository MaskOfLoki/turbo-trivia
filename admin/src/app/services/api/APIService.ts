import { wrap, proxy } from 'comlink';
import { Observable, Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { redraw } from 'mithril';
import { IWorkerAPIService } from './IWorkerAPIService';
import { loading } from '../../../../../common/loading';
import { gcLocalStorage, IGCLeader } from '@gamechangerinteractive/xc-backend';
import { isEmptyString } from '@gamechangerinteractive/xc-backend/utils';
import { publishReplay, refCount, map } from 'rxjs/operators';
import { IGameData, IPreset, PercentageMode } from '../../../../../common/common';
import { getFieldValue } from '../../../../../common/utils';
import { IAwardResult, IPaginatedLeadersRequest, IPaginatedLeadersResponse, toPromise } from '../../utils';

export class APIService {
  private _cid: string;
  private _worker: IWorkerAPIService;
  private _states: Map<string, Observable<any>> = new Map();
  private _configs: Map<string, Observable<any>> = new Map();
  private _timeDif = 0;

  public async init(): Promise<void> {
    // eslint-disable-next-line
    const WorkerClass = wrap(new Worker('./WorkerAPIService', { type: 'module' })) as any;
    this._worker = await loading.wrap(new WorkerClass());
    const cid = await gcLocalStorage.getItem<string>('gc.cid');

    if (isEmptyString(cid)) {
      return this.showLoginSettings();
    }

    const result = await this.login(cid);

    if (!result) {
      return this.showLoginSettings();
    } else {
      this.checkSingleAdmin();
      this.timeSyncHandler();
    }
  }

  public async showLoginSettings(reload?: boolean) {
    const cid: string = await gcLocalStorage.getItem<string>('gc.cid');

    await Swal.fire({
      title: 'Settings',
      html:
        `<input id="swal-input1" class="swal2-input" placeholder="Client ID" value="${cid || ''}">` +
        `<input id="swal-input2" class="swal2-input" placeholder="Client Secret">`,
      focusConfirm: false,
      preConfirm: this.settingsPreConfirmHandler.bind(this, reload),
      allowOutsideClick: false,
      allowEscapeKey: true,
      showCloseButton: true,
    });
  }

  private async settingsPreConfirmHandler(reload?: boolean): Promise<void> {
    Swal.resetValidationMessage();
    const id = (document.getElementById('swal-input1') as HTMLInputElement).value.trim();

    if (isEmptyString(id)) {
      Swal.showValidationMessage('Client ID is empty');
      return;
    }

    const secret = (document.getElementById('swal-input2') as HTMLInputElement).value.trim();

    if (isEmptyString(secret)) {
      Swal.showValidationMessage('Client Secret is empty');
      return;
    }

    const isAdmin = await this.login(id, secret);

    if (isAdmin) {
      await gcLocalStorage.setItem('gc.cid', id);

      if (reload) {
        location.reload();
      } else {
        this.checkSingleAdmin();
        this.timeSyncHandler();
        loading.wrap(toPromise(this.state('')));
      }
    } else {
      Swal.showValidationMessage('Invalid Client ID or Client Secret');
    }
  }

  private async checkSingleAdmin() {
    if (!GC_PRODUCTION) {
      return;
    }

    const result = await this._worker.isSingleAdmin();

    if (!result) {
      Swal.fire({
        title:
          'Ignore this message if you have just refreshed the page. It appears that another admin app is currently open. Please only use a single admin at a time to avoid data corruption.',
        icon: 'warning',
      });
    }
  }

  public getPresets(type: string): Promise<IPreset[]> {
    return loading.wrap(this._worker.getPresets(type));
  }

  public savePreset(value: IPreset): Promise<void> {
    return loading.wrap(this._worker.savePreset(value));
  }

  public state<T>(...namespace: string[]): Observable<T> {
    let result: Observable<T> = this._states.get(namespace.join('-'));

    if (result) {
      return result;
    }

    const subject: Subject<T> = new Subject();

    this._worker.watchState<T>(
      proxy((value) => {
        subject.next(value);
        redraw();
      }),
      namespace,
    );

    // TODO: implement unwatch
    result = subject.pipe(publishReplay(1), refCount());
    this._states.set(namespace.join('-'), result);
    return result;
  }

  public config<T>(...namespace: string[]): Observable<T> {
    let result: Observable<T> = this._configs.get(namespace.join('-'));

    if (result) {
      return result;
    }

    const subject: Subject<T> = new Subject();

    this._worker.watchConfig<T>(
      proxy((value) => {
        subject.next(value);
        redraw();
      }),
      namespace,
    );

    result = subject.asObservable().pipe(publishReplay(1), refCount());

    this._configs.set(namespace.join('-'), result);
    return result;
  }

  private async timeSyncHandler() {
    const now = await this._worker.time();
    this._timeDif = Date.now() - now;
    setTimeout(this.timeSyncHandler.bind(this), 60000);
  }

  private async login(id: string, secret?: string): Promise<boolean> {
    const result = await loading.wrap(this._worker.login(id, secret));
    this._cid = id;
    return result;
  }

  public getPaginatedLeaders(value: IPaginatedLeadersRequest): Promise<IPaginatedLeadersResponse> {
    return this._worker.getPaginatedLeaders(value);
  }

  public banUser(user: IGCLeader): Promise<void> {
    return loading.wrap(this._worker.banUser(user));
  }

  public unbanUser(user: IGCLeader): Promise<void> {
    return loading.wrap(this._worker.unbanUser(user));
  }

  public getLeaders(leaderboard: string, limit?: number): Promise<IGCLeader[]> {
    return this._worker.getLeaders(leaderboard, limit);
  }

  public showResult(): Promise<void> {
    return loading.wrap(this._worker.showResult());
  }

  public async publishGame(
    gameData: IGameData,
    isFreePlay: boolean,
    isAutoRun: boolean,
    revealCountDown: number,
    intermissionCountDown: number,
  ): Promise<void> {
    await loading.wrap(
      this._worker.publishGame(gameData, isFreePlay, isAutoRun, revealCountDown, intermissionCountDown),
    );
  }

  public async resetActive(): Promise<void> {
    await loading.wrap(this._worker.resetActive());
  }

  public async award(winners?: string[], losers?: string[]): Promise<IAwardResult> {
    return loading.wrap(this._worker.award(winners, losers));
  }

  public async startTimerTitle(): Promise<void> {
    return loading.wrap(this._worker.startTimerTitle());
  }

  public async stopTimerTitle(): Promise<void> {
    return loading.wrap(this._worker.stopTimerTitle());
  }

  public async showQuestionIntro(questionIndex: number): Promise<void> {
    return loading.wrap(this._worker.showQuestionIntro(questionIndex));
  }

  public async showMultiQuestion(questionIndex: number): Promise<void> {
    return loading.wrap(this._worker.showMultiQuestion(questionIndex));
  }

  public async showMediaQuestion(questionIndex: number): Promise<void> {
    return loading.wrap(this._worker.showMediaQuestion(questionIndex));
  }

  public async revealCorrectAnswer(questionIndex: number): Promise<void> {
    return loading.wrap(this._worker.revealCorrectAnswer(questionIndex));
  }

  public async showPercentage(percentageMode?: PercentageMode, values?: number[]): Promise<void> {
    return loading.wrap(this._worker.showPercentage(percentageMode, values));
  }

  public setConfigField<T>(field: string, value: T, namespace: string): Promise<void> {
    return loading.wrap(this._worker.setConfigField(field, value, namespace));
  }

  public configField<T>(field: string, namespace: string): Observable<T> {
    return this.config(namespace).pipe(map((value) => getFieldValue(value, field)));
  }

  public time(): number {
    return Date.now() - this._timeDif;
  }

  public getOnlineUsers(): Promise<number> {
    return this._worker.getOnlineUsers();
  }

  public uploadFile(ref: string, value: File): Promise<string> {
    return loading.wrap(this._worker.uploadFile(ref, value));
  }

  public deleteFile(url: string): Promise<void> {
    return loading.wrap(this._worker.deleteFile(url));
  }

  public watchPercentages(callback: (values: number[]) => void): () => void {
    return this._worker.watchPercentages(proxy(callback));
  }

  public get cid(): string {
    return this._cid;
  }
}
