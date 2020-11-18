import { ClassBaseComponent } from '../../../components/class-base';
import { api } from '../../../services/api';
import { redraw, VnodeDOM } from 'mithril';
import { IGCLeader, IGCUser } from '@gamechangerinteractive/xc-backend';
import { orientation } from '../../../services/OrientationService';
import IMask from 'imask';
import { template } from './template';
import desktopStyles from './desktop.module.scss';
import mobileStyles from './mobile.module.scss';
import Swal from 'sweetalert2';

export class ProfileScreen extends ClassBaseComponent {
  private _maskedPhone: IMask.InputMask<{ mask: string }>;
  public players: IGCLeader[] = [];
  public userName = '';
  public userPhone = '';

  constructor() {
    super();
    this._subscriptions.push(api.user.subscribe(this.userHandler.bind(this)));
  }

  public oncreate(vnode: VnodeDOM) {
    super.oncreate(vnode);
    const inputElement: HTMLInputElement = this._element.querySelector('#groupPhone').querySelector('input');
    this._maskedPhone = IMask(inputElement, {
      mask: '0-000-000-0000',
    });
    if (this.userPhone) {
      this._maskedPhone.unmaskedValue = this.userPhone;
    }
    api.markFrontgate();
  }

  private userHandler(value: IGCUser) {
    this.userPhone = value.phone;
    if (this._maskedPhone) {
      this._maskedPhone.unmaskedValue = value.phone;
    }
    this.userName = value.username;
    redraw();
  }

  public async saveHandler() {
    const isValid = await this.validate();

    if (!isValid) {
      return;
    }

    const update: Partial<IGCUser> = {
      username: this.userName,
      phone: this._maskedPhone.unmaskedValue,
    };

    await api.updateUser(update);
  }

  private async validate(): Promise<boolean> {
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

    const isAvailable: boolean = await api.isUsernameAvailable(this.userName);

    if (!isAvailable) {
      Swal.fire({
        icon: 'warning',
        title: 'Please, provide another username',
      });
      return;
    }

    return true;
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
}
