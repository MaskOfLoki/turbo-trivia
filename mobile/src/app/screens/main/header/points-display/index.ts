import { ClassComponent, Vnode, VnodeDOM, redraw } from 'mithril';
import { template } from './template';
import desktopStyles from './desktop.module.scss';
import mobileStyles from './mobile.module.scss';
import { orientation } from '../../../../services/OrientationService';
import { delay } from '../../../../utils';

export interface IPointsDisplayAttrs {
  points: number;
  rank: number;
}

export class PointsDisplay implements ClassComponent<IPointsDisplayAttrs> {
  private _beginPoints = 0;
  private _endPoints = 0;
  private _rank = 0;
  private _isAnimating = false;
  private _pointsBGDidAnimateIn = false;
  private _startSparks = false;
  private _startLine = false;
  private _startGlowLine = false;
  private _startCountUp = false;

  public oncreate({ attrs }: VnodeDOM<IPointsDisplayAttrs>) {
    this._endPoints = attrs.points;
    this._rank = attrs.rank;
    if (!this._pointsBGDidAnimateIn && this._endPoints !== 0) {
      this.animatePointsBG();
      this.animatePoints();
    }
  }

  private animatePointsBG(reverse = true) {
    document.getElementById(this.styles.points).classList.toggle(this.styles.pointsIn);
    document.getElementById(this.styles.rank).classList.toggle(this.styles.rankIn);
    this._pointsBGDidAnimateIn = reverse;
  }

  private animatePoints() {
    this._startLine = true;
    this._isAnimating = true;
    redraw();
  }

  private animatePointsOnly() {
    this._startCountUp = true;
    redraw();
  }

  public startPhase2() {
    this._startGlowLine = true;
    this._startCountUp = true;
    redraw();
    delay(2750).then(() => {
      this._startLine = false;
      redraw();
    });
  }

  public playSparks() {
    this._startSparks = true;
    redraw();
  }

  public noOp() {
    this._startCountUp = false;
    redraw();
  }

  public resetAnimation() {
    this._startLine = false;
    this._startGlowLine = false;
    this._startCountUp = false;
    this._startSparks = false;
    this._isAnimating = false;
    redraw();
  }

  public onbeforeupdate(
    vnode: Vnode<IPointsDisplayAttrs, this>,
    oldVnode: VnodeDOM<IPointsDisplayAttrs, this>,
  ): boolean {
    if (vnode.attrs !== oldVnode.attrs) {
      if (vnode.attrs.points !== oldVnode.attrs.points) {
        if (vnode.attrs.points === null) {
          return false;
        }

        this._beginPoints = this._endPoints;
        this._endPoints = vnode.attrs.points;
        this._rank = vnode.attrs.rank;

        if (!this._pointsBGDidAnimateIn && !this._isAnimating && this._endPoints !== 0) {
          this.animatePointsBG();
          this.animatePoints();
        } else if (this._pointsBGDidAnimateIn && !this._isAnimating && this._endPoints !== 0) {
          this.animatePoints();
        } else if (
          this._pointsBGDidAnimateIn &&
          !this._isAnimating &&
          this._endPoints === 0 &&
          this._beginPoints !== 0
        ) {
          this.animatePointsBG(false);
          this.animatePointsOnly();
        }
      }
      return true;
    } else {
      return false;
    }
  }

  public get endPoints() {
    return this._endPoints;
  }

  public get beginPoints() {
    return this._beginPoints;
  }

  public get rank() {
    return this._rank;
  }

  public get startSparks() {
    return this._startSparks;
  }

  public get startLine() {
    return this._startLine;
  }

  public get startGlowLine() {
    return this._startGlowLine;
  }

  public get startCountUp() {
    return this._startCountUp;
  }

  public get styles() {
    if (orientation.isMobile) {
      return mobileStyles;
    } else {
      return desktopStyles;
    }
  }

  public view() {
    return template.call(this);
  }
}
export default PointsDisplay;
