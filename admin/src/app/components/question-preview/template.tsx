import { QuestionPreview } from './index';
import m from 'mithril';
import styles from './module.scss';
import { getMediaType } from '../../../../../common/utils';
import { Player } from '../../../../../common/components/player';
import { QuestionType } from '../../../../../common/common';

export function template(this: QuestionPreview) {
  const imageStyle: Partial<CSSStyleDeclaration> = {};
  let hasImageHeader = false;

  if (this.question?.file?.url && getMediaType(this.question?.file?.url) == 'image') {
    imageStyle.backgroundImage = `url(${this.question?.file?.url})`;
    imageStyle.backgroundSize = 'contain';
    hasImageHeader = true;
  }

  return (
    <div class={styles.control}>
      <div class={styles.control} style={imageStyle}>
        {this.questionNo != null && <div class={styles.questionNo}>QUESTION #{this.questionNo + 1}</div>}
        {this.question?.file?.url && getMediaType(this.question?.file?.url) == 'video' && (
          <Player src={this.question.file.url} class={styles.video}></Player>
        )}
        {this.question?.type === QuestionType.QUESTION_MULTI && hasImageHeader === false && (
          <div class={styles.questionText}>{this.question?.text}</div>
        )}
      </div>
      {this.question?.type === QuestionType.QUESTION_MULTI && hasImageHeader === true && (
        <div class={styles.questionText}>{this.question?.text}</div>
      )}
    </div>
  );
}
