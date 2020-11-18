import { QuestionShowScreen } from './index';
import styles from './module.scss';
import m, { redraw } from 'mithril';
import { config } from '../../../services/ConfigService';
import { AnswerCountDown } from './answer-countdown';
import { isEmptyString } from '@gamechangerinteractive/xc-backend/utils';
import cn from 'classnames';
import { getMediaType, isImageBasedQuestion, formatTime } from '../../../../../../common/utils';
import { AudioPlayer } from './audio-player';
import { VideoPlayer } from './video-player';
import { QuestionType } from '../../../../../../common/common';

export function template(this: QuestionShowScreen) {
  const isImageBased = isImageBasedQuestion(this.question);

  return (
    <div class={styles.screen}>
      <div class={cn(styles.questionMain, { [styles.questionImageBased]: isImageBased })}>
        <div class={cn(styles.question, { [styles.mediaQuestion]: this.question?.type === QuestionType.MEDIA })}>
          {this.question?.type == QuestionType.MEDIA && (
            <div class={styles.mediaText} style={{ color: config.colors?.text }}>
              {this.question?.text}
            </div>
          )}
          {!isEmptyString(this.question?.file?.url) && getMediaType(this.question?.file?.url) == 'image' && (
            <div
              class={styles.questionImage}
              style={{
                backgroundImage: `url(${this.question?.file?.url})`,
                color: config.colors?.text,
              }}
            ></div>
          )}
          {!isEmptyString(this.question?.file?.url) && getMediaType(this.question?.file?.url) == 'video' && (
            <div
              class={cn(styles.questionVideo, { [styles.mediaQuestion]: this.question?.type === QuestionType.MEDIA })}
            >
              <VideoPlayer
                src={this.question.file?.url}
                isFullWidth={this.question?.type === QuestionType.MEDIA}
              ></VideoPlayer>
            </div>
          )}
          {!isEmptyString(this.question?.file?.url) && getMediaType(this.question?.file?.url) == 'audio' && (
            <div
              class={cn(styles.questionAudio, { [styles.mediaQuestion]: this.question?.type === QuestionType.MEDIA })}
            >
              <AudioPlayer src={this.question.file?.url}></AudioPlayer>
            </div>
          )}
          {this.question?.type == QuestionType.QUESTION_MULTI && (
            <div class={styles.questionText} style={{ color: config.colors?.text }}>
              {this.question?.text}
            </div>
          )}
        </div>
        {this.question?.type == QuestionType.QUESTION_MULTI && (
          <div class={styles.questionNoAndTimer}>
            <div class={styles.questionNo} style={{ color: config.colors?.text }}>
              Question {this.state?.questionIndex + 1}/{this.state?.game?.questions.length}
            </div>
            <div class={styles.answerCountDown}>
              {this.question?.type == QuestionType.QUESTION_MULTI && !this.state?.showCorrectAnswer && (
                <AnswerCountDown
                  ref={this.onLoadAnswerCountDown.bind(this)}
                  fontSize={'3vmax'}
                  class={styles.countDown}
                  color={config.colors.primary}
                  txtColor={config.colors.text}
                ></AnswerCountDown>
              )}
            </div>
          </div>
        )}
      </div>

      {this.question?.type == QuestionType.QUESTION_MULTI && (
        <div class={styles.answers}>
          <div class={cn(styles.answerList, { [styles.isImageBased]: isImageBased })}>
            {this.question?.answers.map((answer, index) => {
              const correct = this.showCorrect && answer.correct;
              return (
                <div class={styles.answerContainer}>
                  <div
                    class={cn(styles.answerItem, {
                      [styles.correct]: correct,
                      [styles.display]: this.firstRender,
                    })}
                  >
                    {isImageBased && (
                      <div
                        class={styles.answerImage}
                        style={{
                          background: `url(${answer.image})`,
                        }}
                      />
                    )}
                    <div class={styles.answerText} style={{ color: config.colors?.text }}>
                      <div class={styles.text}>{answer?.text}</div>
                      {this.state && this.state?.showCorrectAnswer && this.state?.percentageMode && this.percentage && (
                        <div class={styles.percentage} style={{ color: config.colors?.text }}>
                          {this.percentage[index] + '%'}
                        </div>
                      )}
                    </div>
                    {this.state && this.state?.showCorrectAnswer && correct && (
                      <div
                        class={cn(styles.statusIcon, {
                          [styles.correct]: correct,
                        })}
                      >
                        {correct ? '✓' : ''}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
