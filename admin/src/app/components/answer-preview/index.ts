import { template } from './template';
import { ClassComponent, Vnode } from 'mithril';
import { IAnswer, IQuestion } from '../../../../../common/common';

interface IAnswerPreviewAttrs {
  question: IQuestion;
}

export class AnswerPreview implements ClassComponent<IAnswerPreviewAttrs> {
  public question: IQuestion;

  public oninit(vnode: Vnode<IAnswerPreviewAttrs>) {
    this.onbeforeupdate(vnode);
  }

  public onbeforeupdate({ attrs }: Vnode<IAnswerPreviewAttrs>) {
    this.question = attrs.question;
  }

  public view() {
    return template.call(this);
  }
}
