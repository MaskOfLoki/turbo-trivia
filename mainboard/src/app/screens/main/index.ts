import { route, Vnode } from 'mithril';
import { IState } from '../../../../../common/common';
import { ClassBaseComponent } from '../../components/class-base';
import { api } from '../../services/api';
import { template } from './template';

export class MainScreen extends ClassBaseComponent {
  constructor() {
    super();
    this._subscriptions.push(api.state.subscribe(this.stateHandler.bind(this)));
  }

  public view(vnode: Vnode) {
    return template.call(this, vnode);
  }

  private stateHandler(value: IState) {
    if (!value.game) {
      route.set('/wait');
      return;
    }

    if (value.showResult || value.isAwarded) {
      route.set('/end');
      return;
    }

    if (value.timerTitleStarted) {
      route.set('/countdown');
      return;
    }

    if (value.questionIndex != null && value.showQuestionIntro) {
      route.set('/question-intro');
      return;
    }

    if (value.questionIndex != null && value.showQuestion) {
      route.set('/question-show');
      return;
    }

    route.set('/wait');
  }
}
