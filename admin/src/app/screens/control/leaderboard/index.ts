import { isEmptyString } from '@gamechangerinteractive/xc-backend/utils';
import { ClassComponent, redraw, Vnode } from 'mithril';
import { api } from '../../../services/api';
import { template } from './template';
import deepEqual from 'fast-deep-equal';
import { IGCLeader, IGCUser } from '@gamechangerinteractive/xc-backend';
import Swal from 'sweetalert2';

interface ILeaderboardAttrs {
  leaderboard: string;
  ref: (value: Leaderboard) => void;
}

export class Leaderboard implements ClassComponent {
  public isLeaderboardDisplay = true;

  private _leaderboard: string;
  public leaders: IGCLeader[] = [];
  public bannedUsers: IGCUser[] = [];
  private _unwatch: () => void;

  public oninit(vnode: Vnode<ILeaderboardAttrs, this>) {
    if (vnode.attrs.ref) {
      vnode.attrs.ref(this);
    }
    this.onbeforeupdate(vnode);
  }

  public onbeforeupdate(vnode: Vnode<ILeaderboardAttrs, this>) {
    if (this._leaderboard == vnode.attrs.leaderboard) {
      return;
    }

    this._leaderboard = vnode.attrs.leaderboard;
    this.startWatching();
  }

  public async removeBtnHandler(user: IGCLeader) {
    const result = await Swal.fire({
      title: `Are you sure you want to ban ${user.username}?`,
      showCancelButton: true,
    });

    if (result.dismiss) {
      return;
    }

    await api.banUser(user);
  }

  public async unbanUserHandler(user: IGCLeader) {
    const result = await Swal.fire({
      title: `Are you sure you want to unban ${user.username}?`,
      showCancelButton: true,
    });

    if (result.dismiss) {
      return;
    }

    await api.unbanUser(user);
  }

  private startWatching() {
    this.stopWatching();

    if (isEmptyString(this._leaderboard)) {
      return;
    }

    let timer: number;
    let isStopped: boolean;

    const timerHandler = async () => {
      const result = await api.getLeaders(this._leaderboard, 10);

      const bannedResult = await api.getPaginatedLeaders({
        channel: '',
        limit: 50,
        skip: 0,
        filters: [],
        bannedOnly: true,
      });

      if (isStopped) {
        return;
      }

      const bannedUsers = bannedResult.items;

      const leaders = result ?? [];

      if (!deepEqual(bannedUsers, this.bannedUsers)) {
        this.bannedUsers = bannedUsers;
      }

      if (!deepEqual(leaders, this.leaders)) {
        this.leaders = leaders;
      }

      timer = window.setTimeout(timerHandler, 2000);
      redraw();
    };

    timerHandler();

    this._unwatch = () => {
      isStopped = true;
      clearTimeout(timer);
    };
  }

  public stopWatching() {
    if (this._unwatch) {
      this._unwatch();
      this._unwatch = undefined;
    }
  }

  public onremove() {
    this.stopWatching();
  }

  public view() {
    return template.call(this);
  }
}
