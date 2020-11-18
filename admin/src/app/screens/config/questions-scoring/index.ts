import { cloneObject, uuid } from '@gamechangerinteractive/xc-backend/utils';
import { redraw, Vnode, VnodeDOM } from 'mithril';
import Swal from 'sweetalert2';
import { IQuestion, ISlot, QuestionType } from '../../../../../../common/common';
import { PopupManager } from '../../../../../../common/popups/PopupManager';
import { EditQuestionPopup } from '../../../components/popups/edit-question-popup';
import { EditType } from '../../../utils';
import { ConfigComponent, IConfigComponentAttrs } from '../../../utils/ConfigComponent';
import { template } from './template';
import { Sortable } from '@shopify/draggable';
import deepEqual from 'fast-deep-equal';
import styles from './module.scss';

export const QUESTION_COUNTDOWN_LIST = [5, 10, 20, 30, 40, 50, 100, 200];
export const POINT_COUNTDOWN_LIST = [5, 10, 20, 30, 40, 50, 100, 200];
export const DEFAULT_COUNTDOWN_VALUE = 5;

export class QuestionsScoringScreen extends ConfigComponent<IConfigComponentAttrs> {
  public isRoundBased = false;
  public selectedQuestionIndex;
  private _sortable: Sortable;
  private _questionListElement: HTMLElement;

  public view() {
    return template.call(this);
  }

  public oncreate({ dom }: VnodeDOM) {
    this._questionListElement = dom.querySelector(`.${styles.questionList}`);
  }

  public onbeforeupdate(vnode: Vnode<IConfigComponentAttrs>) {
    super.onbeforeupdate(vnode);
    this.createSortable();
  }

  public changeQuestionCountDown(value: number) {
    if (!value) {
      this.slot.data.questionTimer = DEFAULT_COUNTDOWN_VALUE;
    } else {
      this.slot.data.questionTimer = value;
    }
    this.saveConfig();
    redraw();
  }

  public changePointsCountDown(value: number) {
    if (!value) {
      this.slot.data.gamePoints = DEFAULT_COUNTDOWN_VALUE;
    } else {
      this.slot.data.gamePoints = value;
    }
    this.saveConfig();
    redraw();
  }

  public onremove() {
    if (this._sortable) {
      this._sortable.destroy();
    }
  }

  private createSortable() {
    if (this._sortable) {
      this._sortable.destroy();
    }

    this._sortable = new Sortable(this._questionListElement, {
      draggable: `.${styles.questionItem}`,
    });

    this._sortable.on('sortable:stop', this.sortStopHandler.bind(this));
  }

  private async sortStopHandler(e) {
    const questionsElements: HTMLElement[] = Array.from(
      this._questionListElement.querySelectorAll(`.${styles.questionItem}`),
    ).filter(
      (item) => !item.classList.contains('draggable-mirror') && !item.classList.contains('draggable--original'),
    ) as HTMLElement[];

    const questions = [...this.slot.data.questions];

    questionsElements.forEach(
      (element, index) => (questions[index] = this.slot.data.questions.find((question) => question.id === element.id)),
    );

    if (!deepEqual(this.slot.data.questions, questions)) {
      this.slot.data.questions = questions;
      await this.saveConfig();
      this.selectedQuestionIndex = this.slot?.data?.questions.length > 0 ? 0 : undefined;
      redraw();
    }
  }

  public async addQuestionHandler() {
    const question: IQuestion = await PopupManager.show(EditQuestionPopup, {
      question: { id: uuid(), text: '', answers: [] },
      type: EditType.NEW,
    });

    if (question) {
      this.slot.data.questions.push(question);
      await this.saveConfig();
      this.selectedQuestionIndex = this.slot?.data?.questions.length > 0 ? 0 : undefined;
    }
  }

  public viewQuestionHandler(index: number, event: MouseEvent) {
    if (event && event.which !== 1) {
      return;
    }

    this.selectedQuestionIndex = index;
  }

  public async editQuestionHandler(question: IQuestion, event: MouseEvent) {
    if (event && event.which !== 1) {
      return;
    }

    const ques: IQuestion = await PopupManager.show(EditQuestionPopup, {
      question: cloneObject(question),
      type: EditType.EDIT,
    });

    if (ques) {
      const questionIndex = this.slot.data.questions.findIndex((ques) => ques.id == question.id);
      this.slot.data.questions[questionIndex] = ques;
      await this.saveConfig();
    }
  }

  public async deleteQuestionHandler(question: IQuestion, event: MouseEvent) {
    if (event && event.which !== 1) {
      return;
    }

    const result = await Swal.fire({
      title: `Are you sure that you want to delete:${question.text}?`,
      allowEnterKey: false,
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Yes',
    });

    if (result.value) {
      const questionIndex = this.slot.data.questions.findIndex((q) => q.id == question.id);
      this.slot.data.questions.splice(questionIndex, 1);
      if (this.selectedQuestionIndex === questionIndex) {
        this.selectedQuestionIndex = undefined;
      }
      await this.saveConfig();
      redraw();
    }
  }

  public async addSlotHandler(slot: ISlot) {
    this.slots.push(slot);
    await this.saveConfig();
    this.changeSlotHandler(slot);
  }

  public async deleteSlotHandler(slot: ISlot) {
    const slotIndex = this.slots.findIndex((s) => s.id == slot.id);

    if (slotIndex >= 0) {
      this.slots.splice(slotIndex, 1);
      this.selectedQuestionIndex = undefined;
      await this.saveConfig();
      this.changeSlotHandler(this.slots[0]);
    }
  }

  public changeSlotHandler(slot: ISlot) {
    this.selectedQuestionIndex = undefined;
    this.changeSlot(slot);
    redraw();
  }
}
