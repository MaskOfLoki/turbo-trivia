import { FileUpload } from './index';
import m from 'mithril';
import styles from './module.scss';
import cn from 'classnames';
import { getMediaType } from '../../../../../common/utils';
import { isEmptyString } from '@gamechangerinteractive/xc-backend/utils';
import { Tooltip } from '../tooltip';
import { Player } from '../../../../../common/components/player';

export function template(this: FileUpload) {
  const imageStyle: Partial<CSSStyleDeclaration> = {};
  const isValue = !isEmptyString(this.value);

  if (isEmptyString(this.value)) {
    if (this.type == 'image') {
      imageStyle.backgroundImage = 'url(assets/icons/upload.svg)';
    } else {
      imageStyle.backgroundImage = 'url(assets/icons/upload-multi.svg)';
    }
    imageStyle.backgroundSize = '70% 70%';
  } else if (getMediaType(this.value) == 'image') {
    imageStyle.backgroundImage = `url(${this.value})`;
    imageStyle.backgroundSize = 'contain';
  }

  return (
    <div class={cn(styles.fileUpload, ...this.class.split(' '))}>
      <div class={styles.image} style={imageStyle}>
        {getMediaType(this.value) == 'video' && <Player class={styles.video} src={this.value} controls={true} />}
        {getMediaType(this.value) == 'audio' && <Player class={styles.audio} src={this.value} controls={true} />}
      </div>
      <div class={styles.buttonRow}>
        <button class={styles.addBtn} onclick={this.clickHandler.bind(this)}>
          {isValue
            ? this.changeButtonText
              ? this.changeButtonText
              : 'CHANGE'
            : this.addButtonText
            ? this.addButtonText
            : 'INSERT'}
        </button>
        {isValue && (
          <button class={styles.deleteBtn} onclick={this.buttonDeleteHandler.bind(this)}>
            DELETE
          </button>
        )}
        {this.resolutionText && (
          <Tooltip
            content={`<div class="tippy-resolution-label">${this.resolutionText}</div>`}
            allowHTML={true}
            placement='right-start'
          >
            <div class={styles.questionBtn}></div>
          </Tooltip>
        )}
      </div>
    </div>
  );
}
