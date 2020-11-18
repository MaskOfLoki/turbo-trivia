import { ControlScreen } from './index';
import styles from './module.scss';
import m from 'mithril';
import cn from 'classnames';
import { UserCount } from './user-count';
import { AnswerPreview } from '../../components/answer-preview';
import { CountDown } from './countdown';
import { Percentage } from './percentage';
import { Leaderboard } from './leaderboard';
import { QuestionPreview } from '../../components/question-preview';
import { QuestionType } from '../../../../../common/common';
import { isXeo } from '../../utils';

export function template(this: ControlScreen) {
  return (
    <div class={styles.screen}>
      <div class={styles.header}>
        <div class={styles.title}>Turbo Trivia</div>
        <div class={styles.space}></div>
        <div class={styles.resetBtn} onclick={this.resetHandler.bind(this)}>
          Reset
        </div>
      </div>
      <div class={styles.divider}></div>
      <div class={styles.main}>
        <div class={cn(styles.upPanel, { [styles.isXeo]: isXeo() })}>
          <div class={styles.fanCount}>
            <div class={styles.label}>FAN COUNT:</div>
            <div class={styles.space}></div>
            <div class={styles.count}>
              <UserCount></UserCount>
            </div>
          </div>
          {!this.state?.isFreePlay && !this.state?.isAutoRun && (
            <div class={styles.timerCol}>
              <CountDown state={this.state} ref={(value) => (this.countDown = value)}></CountDown>
              <div class={styles.space}></div>
              {!isXeo && this.state?.showResult && (
                <div class={cn(styles.nextBtn)} onclick={this.buttonAwardHandler.bind(this)}>
                  REWARD USERS
                </div>
              )}
              {!this.hasNextQuestion() && this.state?.showCorrectAnswer && !this.state?.showResult && (
                <div class={cn(styles.nextBtn)} onclick={this.showResultHandler.bind(this)}>
                  SHOW RESULTS
                </div>
              )}
              {((!this.state?.showResult && this.hasNextQuestion() && !this.state?.showQuestion) ||
                (!this.hasNextQuestion() && !this.state?.showQuestion && !this.state?.showCorrectAnswer) ||
                (this.hasNextQuestion() && this.state?.showQuestion && this.state?.showCorrectAnswer)) && (
                <div div class={styles.nextBtn} onclick={this.nextQuestionHandler.bind(this)}>
                  Next
                </div>
              )}
              {this.state?.showQuestion && !this.state?.showCorrectAnswer && (
                <div div class={styles.nextBtn} onclick={this.revealQuestionHandler.bind(this)}>
                  REVEAL
                </div>
              )}
            </div>
          )}
          {this.state?.isFreePlay && (
            <div class={styles.timerCol}>
              <div class={styles.freePlayLabel}>
                Free Play
                <div class={styles.freePlayInfo}>
                  <span>Title Timer: {this.state?.game?.titleTimer}</span>
                  <span>Intermission Timer: {this.state?.intermissionCountDown}</span>
                  <span>Reveal Timer: {this.state?.revealCountDown}</span>
                </div>
              </div>
            </div>
          )}
          {this.state?.isAutoRun && (
            <div class={styles.timerCol}>
              <div class={styles.freePlayLabel}>
                Auto Run
                {this.autoRunInfo && <div class={styles.freePlayInfo}>{this.autoRunInfo}</div>}
                {!this.autoRunInfo && (
                  <div class={styles.freePlayInfo}>
                    <span>Title Timer: {this.state?.game?.titleTimer}</span>
                    <span>Intermission Timer: {this.state?.intermissionCountDown}</span>
                    <span>Reveal Timer: {this.state?.revealCountDown}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div class={styles.downPanel}>
          <div class={cn(styles.leftPanel, { [styles.isXeo]: isXeo() })}>
            {!this.state?.isFreePlay && (
              <div class={styles.upRow}>
                <div class={styles.showPercentageCol}>
                  <Percentage
                    state={this.state}
                    ref={(value) => (this.percentage = value)}
                    showPercentageChange={this.showPercentageChangeHandler.bind(this)}
                  ></Percentage>
                </div>
                <div class={styles.verticalLine}></div>
                <div class={styles.currentQuestion}>
                  <div class={styles.currentQuestionText}>
                    CURRENT QUESTION: {this.currentQuestionIndex >= 0 ? `#${this.currentQuestionIndex + 1}` : ''}
                  </div>
                  <div class={styles.currentQuestionContent}>
                    <QuestionPreview question={this.currentQuestion}></QuestionPreview>
                  </div>
                </div>
              </div>
            )}
            {!this.state?.isFreePlay && <div class={styles.horizonLine}></div>}
            <div class={styles.downRow}>
              <div class={styles.questionListCol}>
                <div class={styles.questionLabel}>QUESTIONS</div>
                <div class={styles.questionListWrapper}>
                  <div class={styles.questionList}>
                    {this.gameData?.questions.map((question, index) => (
                      <div
                        class={cn(styles.questionItem, { [styles.selected]: index == this.selectedQuestionIndex })}
                        onclick={this.selectedQuestionChangeHandler.bind(this, index)}
                      >
                        <div class={styles.questionTitle}>QUESTION #{index + 1}</div>
                        <div class={styles.space}></div>
                        <div
                          class={cn(styles.questionIcon, {
                            [styles.isMultiple]:
                              question.type === QuestionType.QUESTION_MULTI && question.answers.length >= 2,
                          })}
                        ></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div class={styles.verticalLine}></div>
              <div class={styles.questionDetailCol}>
                <div class={styles.questionLabel}>
                  QUESTION {this.selectedQuestionIndex >= 0 && `# ${this.selectedQuestionIndex + 1}`}
                </div>
                <div class={styles.answerList}>
                  {this.selectedQuestionIndex >= 0 && (
                    <AnswerPreview question={this.gameData?.questions[this.selectedQuestionIndex]}></AnswerPreview>
                  )}
                </div>
              </div>
            </div>
          </div>
          {!isXeo() && (
            <div class={styles.rightPanel}>
              <Leaderboard ref={(value) => (this.leaderboard = value)} leaderboard={this.state?.sid}></Leaderboard>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
