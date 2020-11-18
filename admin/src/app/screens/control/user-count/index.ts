import { ClassComponent, Vnode, redraw } from 'mithril';
import { template } from './template';
import { api } from '../../../services/api';

export class UserCount implements ClassComponent {
  private _timer: number;
  public userCount: number;

  public oninit() {
    this.refresh();
  }

  private async refresh() {
    clearTimeout(this._timer);

    const result = await api.getOnlineUsers();

    if (result !== this.userCount) {
      this.userCount = result;
      redraw();
    }

    this._timer = window.setTimeout(this.refresh.bind(this), 2000);
  }

  public onremove() {
    clearTimeout(this._timer);
  }

  public view() {
    return template.call(this);
  }
}
