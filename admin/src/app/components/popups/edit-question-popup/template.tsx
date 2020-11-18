import m, { redraw } from 'mithril';
import { EditQuestionPopup, IEditQuestionPopupAttrs, MAX_ANSWER_NUM, MIN_ANSWER_NUM } from '.';
import { Input } from '../../input';
import styles from './module.scss';
import cn from 'classnames';
import { TextArea } from '../../textarea';
import { EditType } from '../../../utils';
import { isEmptyString, uuid } from '@gamechangerinteractive/xc-backend/utils';
import { FileUpload } from '../../file-upload';
import { QuestionType } from '../../../../../../common/common';

export function template(this: EditQuestionPopup, { type, question }: IEditQuestionPopupAttrs) {
  return (
    <div class={styles.editQuestionPopup}>
      <div class={styles.header}>
        <div class={styles.title}>{type == EditType.NEW ? 'ADD NEW QUESTION' : 'EDIT QUESTION'}</div>
        <div class={styles.space}></div>
        <button class={styles.saveBtn} onclick={this.saveHandler.bind(this)}>
          SAVE
        </button>
        <div class={styles.closeBtn} onclick={this.close.bind(this, null)}></div>
      </div>
      <div class={styles.content}>
        <div class={styles.questionTypeRow}>
          <button
            class={cn(styles.questionTypeBtn, { [styles.selected]: question.type === QuestionType.QUESTION_MULTI })}
            onclick={() => {
              question.type = QuestionType.QUESTION_MULTI;
              for (let i = question.answers.length; i < MIN_ANSWER_NUM; i++) {
                question.answers.push({
                  id: uuid(),
                  text: '',
                  correct: false,
                });
              }
              this.selection = null;
            }}
          >
            QUESTION
          </button>
          <button
            class={cn(styles.questionTypeBtn, { [styles.selected]: question.type === QuestionType.MEDIA })}
            onclick={() => {
              question.type = QuestionType.MEDIA;
              question.answers = [];
              this.selection = null;
            }}
          >
            MEDIA
          </button>
        </div>
        <div class={styles.divider}></div>
        <div class={styles.questionContainer}>
          {this.question.type === QuestionType.QUESTION_MULTI && question.answers.length > 0 && (
            <div class={styles.leftCol}>
              <div class={styles.questionInputRow}>
                <div class={styles.questionInput}>
                  <TextArea
                    placeholder='Input Question...'
                    maxlength={120}
                    value={question.text}
                    oninput={(e) => (question.text = e.target.value)}
                  ></TextArea>
                </div>
                <div
                  class={cn(styles.questionFile, { [styles.selected]: !isEmptyString(question.file?.url) })}
                  onclick={() => (this.selection = { type: 'question' })}
                ></div>
              </div>
              <div class={styles.answerListRow}>
                {question.answers.map((item, index) => (
                  <div class={styles.answerItemRow}>
                    <div class={styles.answerInputRow}>
                      <div
                        class={cn(styles.answerRemoveBtn, {
                          [styles.hidden]: question.answers.length <= MIN_ANSWER_NUM,
                        })}
                        onclick={() => {
                          question.answers.splice(index, 1);
                          this.selection = null;
                        }}
                      ></div>
                      <div class={styles.answerInput}>
                        <Input
                          placeholder={`Input Answer #${index + 1}`}
                          maxlength={60}
                          value={item.text}
                          oninput={(e) => (item.text = e.target.value)}
                        ></Input>
                      </div>
                      <div
                        class={cn(styles.answerFile, { [styles.selected]: !isEmptyString(item.image) })}
                        onclick={() => (this.selection = { type: 'answer', id: item.id })}
                      ></div>
                    </div>
                    <div class={styles.answerCheckboxRow}>
                      <div
                        class={cn(styles.answerCheckbox, { [styles.selected]: item.correct })}
                        onclick={() => {
                          item.correct = !item.correct;
                          if (item.correct) {
                            question.answers.map((item1) => {
                              if (item1 != item) item1.correct = false;
                            });
                          }
                        }}
                      ></div>
                      <div class={styles.checkboxLabel}>Correct Answer</div>
                    </div>
                  </div>
                ))}
              </div>
              {this.question.answers.length < MAX_ANSWER_NUM && this.question.answers.length >= MIN_ANSWER_NUM && (
                <div class={styles.addQuestionRow}>
                  <button
                    class={styles.addQuestionBtn}
                    onclick={() => {
                      question.answers.push({
                        id: uuid(),
                        text: '',
                        correct: false,
                      });
                      this.selection = null;
                    }}
                  >
                    ADD ANSWER
                  </button>
                </div>
              )}
            </div>
          )}
          {this.question.type === QuestionType.MEDIA && (
            <div class={styles.leftCol}>
              <div class={styles.questionInputRow}>
                <div class={styles.questionInput}>
                  <TextArea
                    placeholder='Input Question...'
                    maxlength={50}
                    value={question.text}
                    oninput={(e) => (question.text = e.target.value)}
                  ></TextArea>
                </div>
                <div
                  class={cn(styles.questionFile, { [styles.selected]: !isEmptyString(question.file?.url) })}
                  onclick={() => (this.selection = { type: 'question' })}
                ></div>
              </div>
            </div>
          )}
          {this.selection && (
            <div class={styles.rightCol}>
              <div class={styles.box}>
                {this.selection.type == 'answer' && (
                  <FileUpload
                    type='image'
                    value={question.answers.find((item) => this.selection?.id == item.id).image}
                    onchange={(value) => {
                      const selectedAnswer = question.answers.find((item) => this.selection?.id == item.id);
                      selectedAnswer.image = value;
                    }}
                    resolutionText='Image: <br/>Scale (10 x 6) <br/>Suggested Resolution (400 x 240) <br/>Max file Size (25MB)'
                  ></FileUpload>
                )}
                {this.selection.type == 'question' && (
                  <FileUpload
                    type='multi'
                    value={question.file?.url}
                    onchange={(value) => this.questionFileChangeHandler(value)}
                    resolutionText='Includes information on the specs of the uploaded photos, videos, and audio<br/>
                    Image: <br/>Scale (27 x 7) <br/>Suggested Resolution (1080 x 280) <br/>Max file Size (25MB)<br/>
                    Video: <br/>Max file size (25 MB)<br/>Suggested resolution (400 x 240)<br/>
                    Audio: <br/>Max file size (25 MB)'
                  ></FileUpload>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
