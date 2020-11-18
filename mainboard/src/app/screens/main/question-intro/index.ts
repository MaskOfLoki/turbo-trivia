import { template } from './template';
import { ClassBaseComponent } from '../../../components/class-base';
import { api } from '../../../services/api';
import { IState } from '../../../../../../common/common';

export class QuestionIntroScreen extends ClassBaseComponent {
  public questionNo = '';

  constructor() {
    super();
    this._subscriptions.push(api.state.subscribe(this.stateHandler.bind(this)));
  }

  private stateHandler(value: IState) {
    if (value.questionIndex == null) {
      return;
    }

    this.questionNo = (value.questionIndex + 1).toString();
  }

  public view() {
    return template.call(this);
  }
}
