import { api } from '../../../../services/api';
import { IState } from '../../../../../../../common/common';
import { orientation } from '../../../../services/OrientationService';
import { template } from './template';
import desktopStyles from './desktop.module.scss';
import mobileStyles from './mobile.module.scss';
import { BaseScreen } from '../../base';
import { isImageBasedQuestion } from '../../../../../../../common/utils';

export class QuestionIntroScreen extends BaseScreen {
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

    const question = value.game.questions[value.questionIndex];

    if (isImageBasedQuestion(question)) {
      question.answers.forEach((answer) => (new Image().src = answer.image));
    }
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
