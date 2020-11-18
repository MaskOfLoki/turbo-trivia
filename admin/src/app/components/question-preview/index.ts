import { template } from './template';
import { ClassComponent, Vnode } from 'mithril';
import { IQuestion } from '../../../../../common/common';

interface IQuestionPreviewAttrs {
  question: IQuestion;
  questionNo: number;
}

export class QuestionPreview implements ClassComponent<IQuestionPreviewAttrs> {
  public question: IQuestion;
  public questionNo: number = null;

  public oninit(vnode: Vnode<IQuestionPreviewAttrs>) {
    this.onbeforeupdate(vnode);
  }

  public onbeforeupdate({ attrs }: Vnode<IQuestionPreviewAttrs>) {
    this.question = attrs.question;
    this.questionNo = attrs.questionNo;
  }

  public view() {
    return template.call(this);
  }
}
