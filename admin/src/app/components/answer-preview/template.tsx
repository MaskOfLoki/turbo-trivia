import { AnswerPreview } from './index';
import m from 'mithril';
import styles from './module.scss';
import cn from 'classnames';
import { isImageBasedQuestion } from '../../utils';
import { QuestionType } from '../../../../../common/common';

export function template(this: AnswerPreview) {
  const isImageBased = isImageBasedQuestion(this.question);

  let answerWidth = 0;
  let answerHeight = 0;

  if (isImageBased) {
    answerWidth = 45;
    answerHeight = 45;
  } else {
    answerWidth = 95;
    answerHeight =
      this.question?.answers?.length == 2
        ? 25
        : Math.floor(100 / (this.question?.answers?.length ? this.question?.answers?.length : 1)) - 7;
  }

  return (
    <div class={cn(styles.control, { [styles.isImageBased]: isImageBased })}>
      {this.question?.type === QuestionType.QUESTION_MULTI &&
        !isImageBased &&
        this.question?.answers?.map((item, index) => (
          <div
            class={cn(styles.answerItem, { [styles.selected]: item.correct })}
            style={{
              width: `${answerWidth}%`,
              height: `${answerHeight}%`,
              background: `url(${item.image})`,
            }}
          >
            <div class={styles.answerTitle}>
              ANSWER #{index + 1}
              <div class={styles.answerText}>{item.text}</div>
            </div>
            <div class={styles.space}></div>
            <div class={cn(styles.answerCheckbox, { [styles.selected]: item.correct })}></div>
          </div>
        ))}
      {this.question?.type === QuestionType.QUESTION_MULTI &&
        isImageBased &&
        this.question?.answers?.map((item, index) => (
          <div
            style={{
              width: `${answerWidth}%`,
              height: `${answerHeight}%`,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              class={cn(styles.answerItem, { [styles.selected]: item.correct })}
              style={{
                width: '100%',
                height: '100%',
                background: `url(${item.image})`,
              }}
            >
              <div class={styles.space}></div>
              <div class={cn(styles.answerCheckbox, { [styles.selected]: item.correct })}></div>
            </div>
            <div class={styles.answerTitle}>
              ANSWER #{index + 1}
              <div class={styles.answerText}>{item.text}</div>
            </div>
          </div>
        ))}
      {this.question?.type === QuestionType.MEDIA && <div class={styles.mediaTitle}>{this.question?.text}</div>}
    </div>
  );
}
