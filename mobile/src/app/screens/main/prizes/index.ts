import { redraw, VnodeDOM } from 'mithril';
import { BaseScreen } from '../base';
import { api } from '../../../services/api';
import { orientation } from '../../../services/OrientationService';
import { IGCAwardedCoupon } from '@gamechangerinteractive/xc-backend/types/IGCAwardedCoupon';
import desktopStyles from './desktop.module.scss';
import mobileStyles from './mobile.module.scss';
import { template } from './template';

export class PrizesScreen extends BaseScreen {
  private _coupons: IGCAwardedCoupon[] = [];
  private _dialogOpen = false;
  private _dom: Element;
  private _dialog: HTMLDivElement;
  private _selectedCouponImage = '';

  public async oninit() {
    this._coupons = await api.getAwardedCoupons();
    redraw();
  }

  public oncreate(vnode: VnodeDOM<any>) {
    super.oncreate(vnode);
    this._dom = vnode.dom;
    const classname = orientation.isMobile ? mobileStyles.dialogContent : desktopStyles.dialogContent;

    this._dialog = this._dom.querySelector(`.${classname}`);
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

  public openPrize(ev) {
    this._selectedCouponImage = ev.target.style.backgroundImage;

    this._dialogOpen = true;
    const domRect = ev.target.getBoundingClientRect();
    const width = domRect.width / 2;
    const dialogWidth = Math.min(window.innerWidth, window.innerHeight) * 0.85;
    const left = domRect.left + width / 2;
    const top = domRect.top + width / 2;
    const scale = width / dialogWidth;
    this._dialog.style.transform = `translate(${left}px, ${top}px) scale(${scale})`;
    this._dialog.style.opacity = '0';
    setTimeout(() => {
      const left = (window.innerWidth - dialogWidth) / 2;
      const top = (window.innerHeight - dialogWidth) / 2;
      this._dialog.style.transform = `translate(${left}px, ${top}px) scale(1)`;
      this._dialog.style.opacity = '1';
    });

    redraw();
  }

  public closeDialog(ev) {
    this._dialog.style.opacity = '1';
    setTimeout(() => {
      this._dialog.style.opacity = '0';
    });
    setTimeout(() => {
      this._dialogOpen = false;
      redraw();
    }, 300);
  }

  public get coupons() {
    return this._coupons;
  }

  public get dialogOpen() {
    return this._dialogOpen;
  }

  public get selectedCouponImage() {
    return this._selectedCouponImage;
  }
}
