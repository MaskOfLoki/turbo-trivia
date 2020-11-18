import m from 'mithril';
import { Preview } from '.';
import styles from './module.scss';
import cn from 'classnames';
import { MobilePreview } from '../../../../components/mobile-preview';
import { MobilePreviewMode } from '../../../../../../../common/common';
import { MainboardPreview } from '../../../../components/mainboard-preview';

export function template(this: Preview) {
  return (
    <div class={styles.editQuestionPopup}>
      <div class={styles.content}>
        <div class={styles.previewContainer}>
          <div
            class={cn(styles.previewLeftBtn, { [styles.disabled]: this.curPreviewPageIndex == 0 })}
            onclick={() => {
              if (this.curPreviewPageIndex > 0) {
                this.curPreviewPageIndex = this.curPreviewPageIndex - 1;
              }
            }}
          ></div>
          <div class={cn(styles.previewWrapper, { [styles.mobile]: this.curPreviewPageIndex < 3 })}>
            {this.curPreviewPageIndex < 3 && (
              <MobilePreview page={this.previewPages[this.curPreviewPageIndex][0]} class={styles.preview} />
            )}
            {this.curPreviewPageIndex < 3 && this.previewPages[this.curPreviewPageIndex][1] && (
              <MobilePreview page={this.previewPages[this.curPreviewPageIndex][1]} class={styles.preview} />
            )}
            {this.curPreviewPageIndex >= 3 && this.curPreviewPageIndex < 6 && (
              <MobilePreview
                page={this.previewPages[this.curPreviewPageIndex][0]}
                class={styles.preview}
                mode={MobilePreviewMode.DESKTOP}
              />
            )}
            {this.curPreviewPageIndex >= 3 &&
              this.curPreviewPageIndex < 6 &&
              this.previewPages[this.curPreviewPageIndex][1] && (
                <MobilePreview
                  page={this.previewPages[this.curPreviewPageIndex][1]}
                  class={styles.preview}
                  mode={MobilePreviewMode.DESKTOP}
                />
              )}
            {this.curPreviewPageIndex >= 6 && (
              <MainboardPreview page={this.previewPages[this.curPreviewPageIndex][0]} class={styles.preview} />
            )}
            {this.curPreviewPageIndex <= 7 && this.curPreviewPageIndex >= 6 && (
              <MainboardPreview page={this.previewPages[this.curPreviewPageIndex][1]} class={styles.preview} />
            )}
          </div>
          <div
            class={cn(styles.previewRightBtn, {
              [styles.disabled]: this.curPreviewPageIndex == this.previewPages.length - 1,
            })}
            onclick={() => {
              if (this.curPreviewPageIndex < this.previewPages.length - 1) {
                this.curPreviewPageIndex = this.curPreviewPageIndex + 1;
              }
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
