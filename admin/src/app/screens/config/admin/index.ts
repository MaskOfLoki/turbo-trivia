import { cloneObject, isEmptyString } from '@gamechangerinteractive/xc-backend/utils';
import { redraw } from 'mithril';
import { Unsubscribable } from 'rxjs';
import Swal from 'sweetalert2';
import { IConfig, ISignupField, ISlot } from '../../../../../../common/common';
import { loading } from '../../../../../../common/loading';
import { PopupManager } from '../../../../../../common/popups/PopupManager';
import { EditSignupFieldPopup } from '../../../components/popups/edit-signup-field-popup';
import { api } from '../../../services/api';
import { ConfigComponent, IConfigComponentAttrs } from '../../../utils/ConfigComponent';
import { template } from './template';

export const DEFAULT_FIELDS = ['Phone', 'Name'];

export class AdminScreen extends ConfigComponent<IConfigComponentAttrs> {
  public isFreePlay = false;
  public isAutoRun = false;
  public revealCountDown = 7;
  public intermissionCountDown = 5;
  private _fields: ISignupField[] = [];
  private _subscription: Unsubscribable;

  public oninit(vnode) {
    this._subscription = api.config<IConfig>('common').subscribe(this.configHandler.bind(this));
  }

  private configHandler(value: IConfig) {
    this._fields = (value?.signup?.fields ?? []).concat();
  }

  public view() {
    return template.call(this);
  }

  public async buttonAddFieldHandler() {
    const field: ISignupField = await PopupManager.show(EditSignupFieldPopup, { fields: this.fields });

    if (!field) {
      return;
    }

    this._fields.push(field);
    this.updateFields();
    redraw();
  }

  public buttonRemoveFieldHandler(index: number) {
    this._fields.splice(index, 1);
    this.updateFields();
  }

  public async buttonEditFieldHandler(index: number) {
    const field: ISignupField = await PopupManager.show(EditSignupFieldPopup, {
      field: cloneObject(this._fields[index]),
      fields: this.fields,
    });

    if (!field) {
      return;
    }

    this._fields[index] = field;
    this.updateFields();
    redraw();
  }

  private updateFields() {
    loading.wrap(api.setConfigField('signup.fields', this._fields, 'common'));
  }

  public async publishHandler() {
    const error: string = this.validateGame();

    if (!isEmptyString(error)) {
      Swal.fire({
        title: error,
        icon: 'warning',
      });
      return;
    }

    await api.publishGame(
      this.slot.data,
      this.isFreePlay,
      this.isAutoRun,
      this.revealCountDown,
      this.intermissionCountDown,
    );
  }

  private validateGame(): string {
    let result = '';

    if (this.slot.data.questions.length === 0) {
      result += 'This slot has no question. Please add some questions to start.';
    }

    if (isNaN(this.slot.data.titleTimer) || this.slot.data.titleTimer == null || this.slot.data.titleTimer === 0) {
      result += '\nPlease, specify timer countdown.';
    }

    if (
      isNaN(this.slot.data.questionTimer) ||
      this.slot.data.questionTimer == null ||
      this.slot.data.questionTimer === 0
    ) {
      result += '\nPlease, specify question countdown.';
    }

    if (isNaN(this.slot.data.gamePoints) || this.slot.data.gamePoints == null || this.slot.data.gamePoints === 0) {
      result += '\nPlease, specify points countdown.';
    }

    if ((this.isAutoRun || this.isFreePlay) && !(this.revealCountDown >= 5)) {
      result += '\nPlease, input reveal countdown than 5 seconds.';
    }

    if ((this.isAutoRun || this.isFreePlay) && !(this.intermissionCountDown >= 5)) {
      result += '\nPlease, input intermission countdown than 5 seconds.';
    }

    return result;
  }

  public get fields(): ISignupField[] {
    return this._fields;
  }

  public changeSlotHandler(slot: ISlot) {
    this.changeSlot(slot);
    redraw();
  }

  public onremove() {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
