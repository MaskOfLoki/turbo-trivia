import { ClassBaseComponent } from '../../../components/class-base';
import { api } from '../../../services/api';
import { IPointsInfo, IState } from '../../../../../../common/common';
import { redraw, route } from 'mithril';
import { IGCLeader, IGCUser } from '@gamechangerinteractive/xc-backend';
import { isEmptyString } from '@gamechangerinteractive/xc-backend/utils';
import { orientation } from '../../../services/OrientationService';
import { template } from './template';

import { GCLeaderboards } from '@gamechangerinteractive/xc-backend/GCLeaderboards';
import { BaseScreen } from '../base';
import { isXeo } from '../../../utils';
import desktopStyles from './desktop.module.scss';
import mobileStyles from './mobile.module.scss';

export const BASE_SCORE_DELAY = 400;
export const YOUR_SCORE_DELAY = 700;

export class RankScreen extends BaseScreen {
  public players: IGCLeader[] = [];
  private _sid: string;
  private _pointsInfo: IPointsInfo = {
    overall: 0,
    overallRank: 0,
    current: 0,
    currentRank: 0,
  };
  private _userName = '';

  constructor() {
    super();
    this._subscriptions.push(
      api.user.subscribe(this.userHandler.bind(this)),
      api.points.subscribe(this.pointsHandler.bind(this)),
      api.state.subscribe(this.stateHandler.bind(this)),
    );
  }

  private userHandler(value: IGCUser) {
    this._userName = value.username;
    redraw();
  }

  public pointsHandler(pointsInfo: IPointsInfo) {
    this._pointsInfo = pointsInfo;
    redraw();
  }

  private async stateHandler(value: IState) {
    this._sid = value.sid;
    if (!isEmptyString(value.sid)) {
      this.players = await api.getLeaders(value?.sid, 10).then((value: IGCLeader[]) => {
        return this.boostPlayers(value);
      });
    } else {
      if (isXeo()) {
        route.set('/home');
      } else {
        this.players = await api.getLeaders(GCLeaderboards.OVERALL, 10).then((value: IGCLeader[]) => {
          return this.boostPlayers(value);
        });
      }
    }

    redraw();
  }

  private boostPlayers(leaders?: IGCLeader[]): IGCLeader[] {
    if (!leaders) {
      leaders = [];
    }
    if (leaders.length < 10) {
      while (leaders.length < 10) {
        leaders.push({ uid: '', username: '', position: leaders.length, points: 0 });
      }
    }
    return leaders;
  }

  public get rank(): number {
    if (isEmptyString(this._sid)) {
      return this._pointsInfo?.overallRank;
    } else {
      return this._pointsInfo?.currentRank;
    }
  }

  public get points(): number {
    if (isEmptyString(this._sid)) {
      return this._pointsInfo?.overall;
    } else {
      return this._pointsInfo?.current;
    }
  }

  public get userName() {
    return this._userName;
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
