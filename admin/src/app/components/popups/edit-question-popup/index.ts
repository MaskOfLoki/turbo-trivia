import { template } from './template';

import { IPopupAttrs, PopupComponent } from '../../../../../../common/popups/PopupManager';
import { Vnode } from 'mithril';
import { IQuestion, QuestionType } from '../../../../../../common/common';
import { EditType, isImageBasedQuestion } from '../../../utils';
import { isEmptyString } from '@gamechangerinteractive/xc-backend/utils';
import Swal from 'sweetalert2';
import { getMediaType } from '../../../../../../common/utils';
import { fileService } from '../../../services/FileService';

export interface IEditQuestionPopupAttrs extends IPopupAttrs {
  question: IQuestion;
  type: EditType;
}

export interface ISelection {
  type: string;
  id?: string;
}

export const MIN_ANSWER_NUM = 2;
export const MAX_ANSWER_NUM = 4;

export class EditQuestionPopup extends PopupComponent<IEditQuestionPopupAttrs> {
  public question: IQuestion;
  public selection: ISelection;

  public view(vnode: Vnode<IEditQuestionPopupAttrs>) {
    this.question = vnode.attrs?.question;
    return template.call(this, vnode.attrs);
  }

  public saveHandler() {
    if (this.validate()) {
      this.close(this.question);
    }
  }

  public async questionFileChangeHandler(value: string) {
    this.question.file = {
      url: value,
    };

    if (getMediaType(value) == 'video' || getMediaType(value) == 'audio') {
      const duration = await fileService.getMediaDuration(value);
      this.question.file.duration = duration;
    }
  }

  public validate() {
    if (this.question.type === QuestionType.QUESTION_MULTI) {
      return this.validateMultiQuestion();
    } else {
      return this.validateMediaQuestion();
    }
  }

  private validateMultiQuestion() {
    if (isEmptyString(this.question.file?.url) && isEmptyString(this.question.text)) {
      Swal.fire({
        icon: 'warning',
        title: 'Please fill out the question text or upload the question.',
      });
      return false;
    }

    if (
      this.question.file?.url &&
      getMediaType(this.question.file?.url) === 'audio' &&
      isEmptyString(this.question.text)
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Please fill out the question text.',
      });
      return false;
    }

    let answerImageFilledCount = 0;
    let answerTextFilledCount = 0;
    let hasCorrect = false;

    this.question.answers.map((answer) => {
      if (!isEmptyString(answer.text)) {
        answerTextFilledCount++;
      }

      if (!isEmptyString(answer.image)) {
        answerImageFilledCount++;
      }

      if (answer.correct) {
        hasCorrect = true;
      }
    });

    if (answerImageFilledCount > 0 && answerImageFilledCount !== this.question.answers.length) {
      Swal.fire({
        icon: 'warning',
        title: 'All answers must have an image uploaded if one answer has one.',
      });
      return false;
    }

    if (answerTextFilledCount > 0 && answerTextFilledCount !== this.question.answers.length) {
      Swal.fire({
        icon: 'warning',
        title: 'All answers must have a text if one answer has one.',
      });
      return false;
    }

    if (answerImageFilledCount === 0 && answerTextFilledCount === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Please fill out answers or upload images.',
      });
      return false;
    }

    if (!hasCorrect) {
      Swal.fire({
        icon: 'warning',
        title: 'Please select correct answer.',
      });
      return false;
    }

    return true;
  }

  private validateMediaQuestion() {
    if (isEmptyString(this.question.file?.url)) {
      Swal.fire({
        icon: 'warning',
        title: 'Please upload the question media.',
      });
      return false;
    }

    if (isEmptyString(this.question.text)) {
      Swal.fire({
        icon: 'warning',
        title: 'Please input the question text.',
      });
      return false;
    }

    return true;
  }
}
