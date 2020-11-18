import { template } from './template';
import { ClassBaseComponent } from '../../../components/class-base';
import { api } from '../../../services/api';
import { IState } from '../../../../../../common/common';
import { redraw } from 'mithril';
import { IGCLeader } from '@gamechangerinteractive/xc-backend';
import { isEmptyString } from '@gamechangerinteractive/xc-backend/utils';

export const BASE_SCORE_DELAY = 400;
export class EndingScreen extends ClassBaseComponent {
  public players: IGCLeader[] = [];
  public isRoundBased = false;
  public is5RankPage: boolean = null;

  constructor() {
    super();
    this._subscriptions.push(api.state.subscribe(this.stateHandler.bind(this)));
  }

  private async stateHandler(value: IState) {
    if (!isEmptyString(value.sid)) {
      this.players = await api.getLeaders(value.sid, 16).then((value: IGCLeader[]) => {
        return this.boostPlayers(value);
      });
      this.isRoundBased = !!value?.game?.isRoundBased;
      redraw();
    }
  }

  private boostPlayers(leaders?: IGCLeader[]): IGCLeader[] {
    if (!leaders) {
      leaders = [];
    }
    if (leaders.length < 16) {
      while (leaders.length < 16) {
        leaders.push({ uid: '', username: '', position: leaders.length, points: 0 });
      }
    }
    return leaders;
  }

  public view() {
    return template.call(this);
  }
}
