import { randInt } from '@gamechangerinteractive/xc-backend/utils';
import IMask from 'imask';
import { VnodeDOM, redraw, render, route } from 'mithril';
import Swal from 'sweetalert2';
import { ClassBaseComponent } from '../../components/class-base';
import { api } from '../../services/api';
import { config } from '../../services/ConfigService';
import { orientation } from '../../services/OrientationService';
import { template } from './template';
import desktopStyles from './desktop.module.scss';
import mobileStyles from './mobile.module.scss';
import { ResolvePlugin } from 'webpack';

export class FrontGateScreen extends ClassBaseComponent {
  private _maskedPhone: IMask.InputMask<{ mask: string }>;
  private _isSubmitted: boolean;
  public verificationCode = '';
  public userName = '';
  public phoneCode = '1';
  public userOptin = false;
  public phoneNumber = '';

  constructor() {
    super();
    this.userName = `${config.game.defaultUserNamePrefix}${randInt(1000000)}`;
    this.userOptin = config.signup?.anonymous ? !!config.optin?.defaultChecked : false;
  }

  public oncreate(vnode: VnodeDOM) {
    super.oncreate(vnode);
    if (this._element.querySelector('#groupPhone')) {
      const inputElement: HTMLInputElement = this._element.querySelector('#groupPhone').querySelector('input');
      this._maskedPhone = IMask(inputElement, {
        mask: '000-000-0000',
      });
    }
    api.markFrontgate();
  }

  private validateUserName(): boolean {
    this.userName = this.userName.trim();

    if (this.userName.length < 6) {
      Swal.fire({
        icon: 'warning',
        title: 'Please, provide username with at least 6 characters',
      });
      return false;
    }

    if (!this.userName.match(/^[a-zA-Z0-9_.-]*$/gi)) {
      Swal.fire({
        icon: 'warning',
        title: 'Please, provide username without special characters',
      });
      return false;
    }

    return true;
  }

  public async submitHandler() {
    // For showing the animated button
    await new Promise((res) => setTimeout(res, 400));
    const phone = this.phoneCode.split('-').join('') + this._maskedPhone.unmaskedValue.trim();

    if (phone.length !== 11 && phone.length !== 12) {
      Swal.fire({
        icon: 'warning',
        text: 'Please, provide valid phone number.',
      });
      return;
    }

    if (!this.validateUserName()) {
      return;
    }

    try {
      await api.verifyPhone(phone);
      this._isSubmitted = true;
      redraw();
    } catch (e) {
      const message = e.response ? e.response.data : e.toString();
      Swal.fire({
        icon: 'warning',
        text: `Unable to submit phone. Details: ${message}`,
      });
    }
  }

  public nextHandler() {
    if (!this.validateUserName()) {
      return;
    }

    api.updateUser({
      username: this.userName,
      optIn: this.userOptin,
    });
  }

  public async verifyHandler() {
    try {
      await api.verifyPhoneCode(this.verificationCode, this.userName, this.userOptin);
    } catch (e) {
      Swal.fire({
        icon: 'warning',
        text: `Please make sure the verification code is correct`,
      });
    }
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

  public get isSubmitted(): boolean {
    return this._isSubmitted;
  }

  public get validated(): boolean {
    if (!this._maskedPhone) {
      return false;
    }

    const userName = this.userName.trim();
    const phone = this.phoneCode.split('-').join('') + this._maskedPhone.unmaskedValue.trim();

    if (userName.length < 6 || !userName.match(/^[a-zA-Z0-9_.-]*$/gi) || (phone.length !== 11 && phone.length !== 12)) {
      return false;
    }

    return true;
  }
}
