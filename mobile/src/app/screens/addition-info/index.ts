import { isEmptyString } from '@gamechangerinteractive/xc-backend/utils';
import { redraw } from 'mithril';
import { ClassBaseComponent } from '../../components/class-base';
import { orientation } from '../../services/OrientationService';
import { template } from './template';
import desktopStyles from './desktop.module.scss';
import mobileStyles from './mobile.module.scss';
import { api } from '../../services/api';
import { IMultipleChoiceSignupField, ISignupField, IUser, SignupFieldType } from '../../../../../common/common';
import { map } from 'rxjs/operators';

export class AdditionInfoScreen extends ClassBaseComponent {
  private _fields: ISignupField[] = [];
  private _user: IUser;
  public values: Partial<IUser> = {};

  constructor() {
    super();
    this._subscriptions = [
      api.user.subscribe(this.userHandler.bind(this)),
      api.config.pipe(map((value) => value.signup.fields)).subscribe(this.fieldsHandler.bind(this)),
    ];
  }

  public async buttonSaveHandler() {
    await api.updateUser(this.values);
  }

  private fieldsHandler(value: ISignupField[]) {
    this._fields = value;
    this.invalidate();
  }

  private userHandler(value: IUser) {
    this._user = value;
    this.invalidate();
  }

  private invalidate() {
    if (this._fields.length === 0 || !this._user) {
      return;
    }

    this.values = {};
    this._fields.forEach((field) => {
      this.values[field.name] = this._user[field.name];

      if (field.type === SignupFieldType.MULTIPLE_CHOICE) {
        const select = field as IMultipleChoiceSignupField;
        // Default to having the first option selected
        if (this.values[field.name] === undefined) {
          this.values[field.name] = select.options[0];
        } else if (!select.options.find((item) => item === this.values[field.name])) {
          // If the selected value no longer exists, make them choose again
          delete this.values[field.name];
        }
      }
    });

    this._fields = this._fields.filter((field) => isEmptyString(this._user[field.name]));

    redraw();
  }

  public view() {
    return template.call(this);
  }

  public get styles() {
    if (orientation.isMobile) {
      return mobileStyles;
    } else {
      return desktopStyles;
    }
  }

  public get fields(): ISignupField[] {
    return this._fields;
  }

  public get isSaveAvailable(): boolean {
    return !this._fields.some((field) => isEmptyString(this.values[field.name]));
  }
}
