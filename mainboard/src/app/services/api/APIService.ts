import { IWorkerAPIService } from './IWorkerAPIService';
import { proxy, wrap } from 'comlink';
import Swal from 'sweetalert2';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { redraw } from 'mithril';
import { loading } from '../../../../../common/loading';
import { gcLocalStorage, IGCLeader } from '@gamechangerinteractive/xc-backend';
import { isEmptyString } from '@gamechangerinteractive/xc-backend/utils';
import { IConfig, IState } from '../../../../../common/common';
import { isPreview } from '../../../../../common/utils/query';

export class APIService {
  private _worker: IWorkerAPIService;
  private _state: IState = {};
  private _timeDif = 0;
  private readonly _stateSubject: Subject<IState> = new ReplaySubject(1);
  private readonly _configSubject: Subject<IConfig> = new ReplaySubject(1);

  public readonly state: Observable<IState> = this._stateSubject;
  public readonly config: Observable<IConfig> = this._configSubject;

  public async init(): Promise<void> {
    const WorkerClass = wrap(new Worker('./WorkerAPIService', { type: 'module' })) as any;

    if (isPreview()) {
      const { preview } = await import('../PreviewService');
      this._worker = preview;
    } else {
      this._worker = await loading.wrap(new WorkerClass());
    }

    this._worker.init(
      proxy((value) => this.stateHandler(value)),
      proxy((value) => this.configHandler(value)),
    );

    const cid = await gcLocalStorage.getItem<string>('gc.cid');

    if (isEmptyString(cid)) {
      this.showLoginSettings();
      return;
    }

    const result = await this.login(cid);

    if (!result) {
      this.showLoginSettings();
    } else {
      this.timeSyncHandler();
    }
  }

  private async timeSyncHandler() {
    const now = await this._worker.time();
    this._timeDif = Date.now() - now;
    setTimeout(this.timeSyncHandler.bind(this), 60000);
  }

  private configHandler(value: IConfig) {
    this._configSubject.next(value);
    redraw();
  }

  public async showLoginSettings() {
    const cid: string = await gcLocalStorage.getItem<string>('gc.cid');

    await Swal.fire({
      title: 'Settings',
      html:
        `<input id="swal-input1" class="swal2-input" placeholder="Client ID" value="${cid || ''}">` +
        `<input id="swal-input2" class="swal2-input" placeholder="Client Secret">`,
      focusConfirm: false,
      preConfirm: this.settingsPreConfirmHandler.bind(this),
      allowOutsideClick: false,
      allowEscapeKey: false,
    });
  }

  private async settingsPreConfirmHandler(): Promise<void> {
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
    } else {
      Swal.showValidationMessage('Invalid Client ID or Client Secret');
    }
  }

  private login(id: string, secret?: string): Promise<boolean> {
    return loading.wrap(this._worker.login(id, secret));
  }

  private stateHandler(value: IState) {
    this._state = value;
    this._stateSubject.next(value);
    redraw();
  }

  public getLeaders(leaderboard: string, limit?: number): Promise<IGCLeader[]> {
    return this._worker.getLeaders(leaderboard, limit);
  }

  public time(): number {
    return Date.now() - this._timeDif;
  }
}
