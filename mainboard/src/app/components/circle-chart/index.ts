import { ClassComponent, VnodeDOM } from 'mithril';
import { template } from './template';
import { Circle } from 'progressbar.js';
import styles from './module.scss';

export interface ICircleChartAttrs {
  class?: string;
  color?: string;
  txtColor?: string;
  strokeWidth?: string;
  fontSize: string;
  value?: number;
  label?: string;
}

export class CircleChart implements ClassComponent<ICircleChartAttrs> {
  private _bar: Circle;
  private _value: number;

  public oncreate({ dom, attrs }: VnodeDOM<ICircleChartAttrs>) {
    this._bar = new Circle(dom.querySelector(`.${styles.container}`), {
      strokeWidth: attrs.strokeWidth ?? 5,
      color: attrs.color ?? '#00f0ff',
      trailWidth: 1,
      trailColor: attrs.txtColor ?? 'white',
      duration: 1200,
      text: {
        style: {
          background: `radial-gradient(
            circle at center,
            ${attrs.color} 0%,
            rgba(1, 236, 252, 0) 65%,
            rgba(1, 236, 252, 0) 100%
          )`,
          fontSize: attrs.fontSize,
          color: attrs.txtColor ?? 'white',
          position: 'absolute',
          left: '50%',
          top: '50%',
          padding: 0,
          margin: 0,
          transform: {
            prefix: true,
            value: 'translate(-50%, -50%)',
          },
        },
      },
    });
    this._bar.path.style.strokeLinecap = 'round';
    // we scale down the circle, so glow won't be cut by element borders
    this._bar.path.style.transform = 'translateX(5%) translateY(5%) scale(0.9)';
    this._bar.trail.style.transform = 'translateX(12%) translateY(12%) scale(0.76)';
    this._bar.set(attrs.value ?? 0);
    this._value = attrs.value;
  }

  public view({ attrs }) {
    const step = attrs.value - this._value;
    this._value = attrs.value;
    if (this._bar) {
      if (attrs.value !== this._bar.value()) {
        this._bar.animate(attrs.value + step >= 0 ? attrs.value + step : 0);
      }

      if (attrs.label !== this._bar.text) {
        this._bar.setText(attrs.label);
      }
    }

    return template.call(this, attrs);
  }

  public onremove() {
    this._bar.destroy();
  }
}
