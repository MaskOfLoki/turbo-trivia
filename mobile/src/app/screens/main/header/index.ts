import { ClassBaseComponent } from '../../../components/class-base';
import { api } from '../../../services/api';
import { redraw, render, route } from 'mithril';
import { orientation } from '../../../services/OrientationService';
import { template } from './template';
import desktopStyles from './desktop.module.scss';
import mobileStyles from './mobile.module.scss';
import { IPointsInfo, IState } from '../../../../../../common/common';
import { isEmptyString } from '@gamechangerinteractive/xc-backend/utils';
import { IGCUser } from '@gamechangerinteractive/xc-backend';

export class Header extends ClassBaseComponent {
  private _sid: string;
  private _slideNavigation: Element;
  private _pointsInfo: IPointsInfo = {
    overall: 0,
    overallRank: 0,
    current: 0,
    currentRank: 0,
  };
  private _userName = '';
  private _clickAnywhereFunc: (e: any) => {};
  public isSideNavVisible = false;
  public isTermConditionView = false;

  constructor() {
    super();
    this._clickAnywhereFunc = this.clickAnywhereHandler.bind(this);
  }

  public oninit() {
    this._subscriptions.push(
      api.user.subscribe(this.userHandler.bind(this)),
      api.state.subscribe(this.stateHandler.bind(this)),
      api.points.subscribe(this.pointsHandler.bind(this)),
    );
  }

  public oncreate() {
    this._slideNavigation = document.getElementById(this.styles.slideNav);
    redraw();
  }

  private userHandler(value: IGCUser) {
    this._userName = value.username;
    redraw();
  }

  public stateHandler(state: IState) {
    this._sid = state.sid;
    redraw();
  }

  public pointsHandler(pointsInfo: IPointsInfo) {
    this._pointsInfo = pointsInfo;
    redraw();
  }

  public get rank(): number {
    if (isEmptyString(this._sid)) {
      return this._pointsInfo?.overallRank;
    } else {
      return this._pointsInfo?.currentRank;
    }
  }

  public get rankOverall(): number {
    return this._pointsInfo.overallRank;
  }

  public get rankCurrent(): number {
    return this._pointsInfo.currentRank;
  }

  public get points(): number {
    if (isEmptyString(this._sid)) {
      return this._pointsInfo?.overall;
    } else {
      return this._pointsInfo?.current;
    }
  }

  public get pointsOverall(): number {
    return this._pointsInfo.overall;
  }

  public get pointsCurrent(): number {
    return this._pointsInfo.current;
  }

  public view() {
    return template.call(this);
  }

  public onRouterClick(routePath) {
    route.set(routePath);
    document.getElementById(this.styles.menuButton).click();
  }

  public get styles() {
    if (orientation.isMobile) {
      return mobileStyles;
    } else {
      return desktopStyles;
    }
  }

  public get userName() {
    return this._userName;
  }

  public clickAnywhereHandler(e: any) {
    e.stopPropagation();
    e.preventDefault();
    if (!document.getElementById(this.styles.slideNav).contains(e.target)) {
      document.getElementById(this.styles.menuButton).click();
    }
  }

  public menuClickHandler(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    // const slideNav = document.getElementById(this.styles.slideNav);
    if (this.isSideNavVisible) {
      document.removeEventListener('click', this._clickAnywhereFunc);
    } else {
      document.addEventListener('click', this._clickAnywhereFunc);
    }
    this.isSideNavVisible = !this.isSideNavVisible;
    redraw();
  }

  public termConditionHandler() {
    this.isTermConditionView = !this.isTermConditionView;
  }
}
