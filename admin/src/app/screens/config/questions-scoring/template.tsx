import {
  DEFAULT_COUNTDOWN_VALUE,
  POINT_COUNTDOWN_LIST,
  QuestionsScoringScreen,
  QUESTION_COUNTDOWN_LIST,
} from './index';
import styles from './module.scss';
import m from 'mithril';
import cn from 'classnames';
import { AnswerPreview } from '../../../components/answer-preview';
import { PresetSelect } from '../../../components/preset-select';
import { Slide } from '../../../components/slide';
import { CircleCountDown } from '../../../components/circle-countdown';
import { QuestionPreview } from '../../../components/question-preview';

export function template(this: QuestionsScoringScreen) {
  return (
    <div class={styles.screen}>
      <div class={styles.questionPanel}>
        <div class={styles.questionPanelLeft}>
          <div class={styles.presetRow}>
            <PresetSelect
              slot={this.slot}
              slots={this.slots}
              onAddSlot={this.addSlotHandler.bind(this)}
              onChangeSlot={this.changeSlotHandler.bind(this)}
              onDeleteSlot={this.deleteSlotHandler.bind(this)}
            ></PresetSelect>
          </div>
          <div class={styles.addQuestionRow}>
            <div class={styles.label}>ADD QUESTION</div>
            <div class={styles.addQuestionBtn} onclick={this.addQuestionHandler.bind(this)}>
              +
            </div>
          </div>
          <div class={styles.questionListWrapper}>
            <div class={styles.questionList}>
              {this.slot?.data?.questions.map((item, index) => (
                <div
                  class={cn(styles.questionItem, { [styles.selected]: this.selectedQuestionIndex === index })}
                  key={item.id}
                  id={item.id}
                >
                  <div class={styles.questionTitle}>{item.text ? item.text : `QUESTION #${index + 1}`}</div>
                  <div class={styles.space}></div>
                  <div class={styles.questionViewBtn} onmousedown={this.viewQuestionHandler.bind(this, index)}></div>
                  <div class={styles.questionEditBtn} onmousedown={this.editQuestionHandler.bind(this, item)}></div>
                  <div class={styles.questionDeleteBtn} onmousedown={this.deleteQuestionHandler.bind(this, item)}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div class={styles.questionPanelRight}>
          <div class={styles.label}>QUESTION PREVIEW:</div>
          <div class={styles.previewWrapper}>
            <div class={styles.preview}>
              {this.selectedQuestionIndex >= 0 && (
                <div class={styles.question}>
                  <QuestionPreview
                    question={this.slot?.data?.questions[this.selectedQuestionIndex]}
                    questionNo={this.selectedQuestionIndex}
                  ></QuestionPreview>
                </div>
              )}
              <div class={styles.answerList}>
                {this.selectedQuestionIndex >= 0 && (
                  <AnswerPreview question={this.slot?.data?.questions[this.selectedQuestionIndex]}></AnswerPreview>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class={styles.roundPanel}>
        <div class={styles.roundSelectRow}>
          <div class={styles.label}>ROUND BASED:</div>
          <Slide
            selected={this.slot?.data.isRoundBased}
            onchange={() => {
              this.slot.data.isRoundBased = !this.slot?.data.isRoundBased;
              this.saveConfig();
            }}
          ></Slide>
        </div>
        <div class={styles.titleCountDownRow}>
          <div class={styles.label}>TITLE COUNTDOWN</div>
          <input
            type='number'
            class={styles.input}
            value={this.slot?.data.titleTimer}
            onblur={(e) => {
              if (!e.target.value) {
                this.slot.data.titleTimer = DEFAULT_COUNTDOWN_VALUE;
              } else {
                this.slot.data.titleTimer = parseInt(e.target.value);
              }
              this.saveConfig();
            }}
            placeholder='Custom'
          ></input>
        </div>
        <div class={styles.timerCountDownRow}>
          <CircleCountDown
            value={this.slot?.data.questionTimer}
            values={QUESTION_COUNTDOWN_LIST}
            label={'QUESTION COUNTDOWN'}
            onchange={(value) => this.changeQuestionCountDown(value)}
            onchangeinput={(value) => this.changeQuestionCountDown(value)}
          ></CircleCountDown>
        </div>
        <div class={styles.pointCountDownRow}>
          <CircleCountDown
            value={this.slot?.data.gamePoints}
            values={POINT_COUNTDOWN_LIST}
            label={'POINTS COUNTDOWN'}
            onchange={(value) => this.changePointsCountDown(value)}
            onchangeinput={(value) => this.changePointsCountDown(value)}
          ></CircleCountDown>
        </div>
      </div>
    </div>
  );
}
