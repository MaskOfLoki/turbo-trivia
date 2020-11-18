import { Vnode, VnodeDOM, redraw } from 'mithril';
import { template } from './template';
import { PopupComponent, IPopupAttrs } from '../../../../../common/popups/PopupManager';
import { IGCAwardedCoupon } from '@gamechangerinteractive/xc-backend/types/IGCAwardedCoupon';
import confetti from 'canvas-confetti';

export interface ICouponPopupAttrs extends IPopupAttrs<void> {
  coupon: IGCAwardedCoupon;
}

export class CouponPopup extends PopupComponent<any> {
  private _smokeRatio = 100;

  public oncreate({ dom }: VnodeDOM<ICouponPopupAttrs>) {
    const smoke = dom.querySelector('#smoke');
    this._smokeRatio = (dom.clientWidth * 0.8) / smoke.clientWidth;

    setTimeout(() => {
      const canvas = dom.querySelector('#confetti');
      if (canvas) {
        const myConfetti = confetti.create(canvas, {
          resize: true,
          useWorker: true,
        });
        myConfetti({
          particleCount: 300,
          spread: 90,
          startVelocity: 60,
          gravity: 0.7,
          ticks: 500,
          origin: { y: 0.7 },
        });
      }
    }, 2300);

    redraw();
  }

  public view({ attrs }: Vnode<ICouponPopupAttrs>) {
    return template.call(this, attrs);
  }

  public get smokeRatio() {
    return this._smokeRatio;
  }
}
