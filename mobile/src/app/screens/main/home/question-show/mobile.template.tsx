import { QuestionShowScreen } from './index';
import styles from './mobile.module.scss';
import m from 'mithril';
import { config } from '../../../../services/ConfigService';
import { AnswerCountDown } from './answer-countdown';
import { isEmptyString } from '@gamechangerinteractive/xc-backend/utils';
import cn from 'classnames';
import { getMediaType, isImageBasedQuestion } from '../../../../../../../common/utils';
import { QuestionType } from '../../../../../../../common/common';
import { VideoPlayer } from './video-player';
import { AudioPlayer } from './audio-player';
import hmbAnimData from '../../../../../assets/animation/Spark-Points.json';
import XCAnimateAE, { IXCAnimateConfig } from '../../../../components/animate-ae';

export function mobile(this: QuestionShowScreen) {
  const isImageBased = isImageBasedQuestion(this.question);
  const hmbconfig: IXCAnimateConfig = {
    animation: {
      data: hmbAnimData,
      autoplay: false,
      loop: false,
    },
    play: true,
    timeout: 500,
    id: styles.points,
    width: 75,
    height: 62.5,
    onclick: null,
    onclickPlay: false,
    pingpong: false,
  };
  return (
    <div class={styles.screen}>
      {!isEmptyString(this.question?.file?.url) && getMediaType(this.question?.file?.url) == 'image' && (
        <div
          class={cn(styles.questionImage, { [styles.mediaQuestion]: this.question?.type === QuestionType.MEDIA })}
          style={{
            backgroundImage: `url(${this.question?.file?.url})`,
          }}
        />
      )}
      {!isEmptyString(this.question?.file?.url) && getMediaType(this.question?.file?.url) == 'video' && (
        <div class={cn(styles.questionVideo, { [styles.mediaQuestion]: this.question?.type === QuestionType.MEDIA })}>
          <VideoPlayer src={this.question.file?.url} isFullWidth={this.question?.type === QuestionType.MEDIA} />
        </div>
      )}
      {!isEmptyString(this.question?.file?.url) && getMediaType(this.question?.file?.url) == 'audio' && (
        <div class={cn(styles.questionAudio, { [styles.mediaQuestion]: this.question?.type === QuestionType.MEDIA })}>
          <AudioPlayer src={this.question.file?.url} />
        </div>
      )}
      {!isEmptyString(this.question?.text) && <div class={styles.questionText}>{this.question.text}</div>}
      {this.question?.type === QuestionType.QUESTION_MULTI && (
        <div class={cn(styles.answerList, { [styles.isImageBased]: isImageBased })}>
          {this.question?.answers.map((answer, index) => {
            const correct = this.showCorrect && answer === this.submittedAnswer && answer.correct;
            const incorrect = this.showCorrect && answer === this.submittedAnswer && !answer.correct;
            return (
              <div class={styles.answerContainer} onclick={this.answerSelectHandler.bind(this, answer)}>
                <div
                  class={cn(styles.answerItem, {
                    [styles.selected]: answer === this.selectedAnswer,
                    [styles.correct]: this.showCorrect && answer.correct,
                    [styles.incorrect]: incorrect,
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
                  {this.state && this.state?.showCorrectAnswer && this.submittedAnswer && (correct || incorrect) && (
                    <div
                      class={cn(styles.statusIcon, {
                        [styles.correct]: correct,
                        [styles.incorrect]: incorrect,
                      })}
                    >
                      {correct ? '✓' : incorrect ? '✕' : ''}
                    </div>
                  )}
                  {this.state && this.state?.showCorrectAnswer && this.submittedAnswer && correct && this.points > 0 && (
                    <div class={styles.animationContainer}>
                      <XCAnimateAE config={hmbconfig} />
                      <div class={styles.pointsLabel}>{this.points}</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {this.question?.type == QuestionType.MEDIA && <div class={styles.answerList} />}
      {this.question?.type == QuestionType.QUESTION_MULTI && (
        <div class={styles.bottomBar}>
          {this.state && !this.state?.showCorrectAnswer && (
            <AnswerCountDown
              class={styles.answerCountDown}
              fontSize='3vmin'
              ref={this.onLoadAnswerCountDown.bind(this)}
            />
          )}
          <div class={styles.space} />
          {!this.showCorrect && (
            <button
              class={cn(styles.submitBtn, {
                [styles.disable]:
                  this.showCorrect ||
                  this.answerCountDown?.pointsValue <= 0 ||
                  !this.selectedAnswer ||
                  this.submittedAnswer,
              })}
              onclick={this.onSubmitHandler.bind(this)}
            >
              {this.submittedAnswer ? 'Submitted' : 'Submit'}
            </button>
          )}
          {this.showCorrect && this.submittedAnswer && (
            <div
              class={cn(styles.answerStatus, {
                [styles.answerStatusCorrect]: this.submittedAnswer.correct,
                [styles.answerStatusIncorrect]: !this.submittedAnswer.correct,
              })}
            >
              <span class={styles.answerStatusIcon}></span>
              {this.submittedAnswer.correct ? 'Correct' : 'Incorrect'}
            </div>
          )}
          {this.showCorrect && !this.submittedAnswer && (
            <div class={styles.noAnswer}>
              <span class={styles.textIcon}>&times;</span> No Answer
            </div>
          )}
        </div>
      )}
      {this.question?.type == QuestionType.MEDIA && (
        <div class={styles.bottomBar}>
          <AnswerCountDown
            class={styles.answerCountDown}
            fontSize='3vmin'
            ref={this.onLoadAnswerCountDown.bind(this)}
          />
        </div>
      )}
    </div>
  );
}
