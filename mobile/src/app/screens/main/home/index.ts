import { route, Vnode } from 'mithril';
import { IState } from '../../../../../../common/common';
import { ClassBaseComponent } from '../../../components/class-base';
import { api } from '../../../services/api';
import { BaseScreen } from '../base';
import { template } from './template';

export class HomeScreen extends BaseScreen {
  constructor() {
    super();
    this._subscriptions.push(api.state.subscribe(this.stateHandler.bind(this)));
  }

  private stateHandler(value: IState) {
    if (!value.game) {
      route.set('/home');
      return;
    }

    if (value.showResult) {
      route.set('/rank');
      return;
    }

    if (value.timerTitleStarted) {
      route.set('/home/countdown');
      return;
    }

    if (value.questionIndex !== null && value.showQuestionIntro) {
      route.set('/home/question-intro');
      return;
    }

    if (value.questionIndex !== null && value.showQuestion) {
      route.set('/home/question-show');
      return;
    }

    route.set('/home');
  }

  public view(vnode: Vnode) {
    return template.call(this, vnode);
  }
}
