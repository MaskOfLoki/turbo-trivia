import { ClassComponent, redraw, route, Vnode } from 'mithril';
import { LogosColorsScreen } from './logos-colors';
import { QuestionsScoringScreen } from './questions-scoring';
import { MobileScreen } from './mobile';
import { template } from './template';
import { MainboardScreen } from './mainboard';
import { DesktopScreen } from './desktop';
import { AdminScreen } from './admin';
import { IPreset, IProject, ISlot, IState } from '../../../../../common/common';
import { Unsubscribable } from 'rxjs';
import { api } from '../../services/api';
import { cloneObject, isEmptyString, uuid } from '@gamechangerinteractive/xc-backend/utils';
import { DEFAULT_GAME_DATA } from '../../utils';

interface IMenuItem {
  label: string;
  component;
}

export class ConfigScreen implements ClassComponent {
  private _subscription: Unsubscribable;
  public project: IProject;
  public slot: ISlot;

  public menus: IMenuItem[] = [
    {
      label: 'QUESTIONS & SCORING',
      component: QuestionsScoringScreen,
    },
    {
      label: 'LOGOS & COLORS',
      component: LogosColorsScreen,
    },
    {
      label: 'MOBILE',
      component: MobileScreen,
    },
    {
      label: 'MAINBOARD',
      component: MainboardScreen,
    },
    {
      label: 'DESKTOP',
      component: DesktopScreen,
    },
    {
      label: 'ADMIN',
      component: AdminScreen,
    },
  ];

  public selectedMenu: IMenuItem = this.menus[0];

  public view() {
    return template.call(this);
  }

  public async oninit() {
    const presets: IPreset[] = await api.getPresets('project');
    this.project = presets.find((item) => item.name === 'DEFAULT') as IProject;

    if (!this.project) {
      this.project = {
        id: uuid(),
        name: 'DEFAULT',
        type: 'project',
        slots: [],
      };

      await api.savePreset(this.project);
    }

    if (this.project.slots.length == 0) {
      this.project.slots = [
        {
          id: 'default',
          name: 'DEFAULT',
          data: cloneObject(DEFAULT_GAME_DATA),
        },
      ];

      await api.savePreset(this.project);
    }

    this.slot = this.project.slots[0];
    this._subscription = api.state('').subscribe(this.stateHandler.bind(this));
    redraw();
  }

  public stateHandler(state: IState) {
    if (!isEmptyString(state.sid)) {
      route.set('/control');
    }
  }

  public async saveConfigHandler() {
    await api.savePreset(this.project);
  }

  public changeSlotHandler(slot: ISlot) {
    this.slot = slot;
  }

  public onremove() {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
