import { MobileScreen } from './index';
import styles from './module.scss';
import m from 'mithril';
import { ConfigImageFileUpload } from '../../../components/config-image-file-upload';
import { ConfigTextArea } from '../../../components/config-textarea';
import { DEFAULT_CONFIG } from '../../../../../../common/common';
import cn from 'classnames';
import { MobilePreview } from '../../../components/mobile-preview';

export function template(this: MobileScreen) {
  return (
    <div class={styles.screen}>
      <div class={styles.leftPanel}>
        <div class={styles.mobileBackground}>
          <div class={styles.label}>MOBILE BACKGROUND:</div>
          <div class={styles.upload}>
            <ConfigImageFileUpload
              addButtonText='Change'
              changeButtonText='Change'
              configField='mobile.background'
              resolutionText='Image: <br/>Scale (9 x 16) <br/>Suggested Resolution (1080 x 1920) <br/>Max file Size (25MB)'
            ></ConfigImageFileUpload>
          </div>
        </div>
        <div class={styles.mobilePreview}>
          <div class={styles.label}>MOBILE PREVIEW:</div>
          <div class={styles.previewContainer}>
            <div
              class={cn(styles.previewLeftBtn, { [styles.disabled]: this.curPreviewPageIndex == 0 })}
              onclick={() => {
                if (this.curPreviewPageIndex > 0) {
                  this.curPreviewPageIndex = this.curPreviewPageIndex - 1;
                }
              }}
            ></div>
            <div class={styles.previewWrapper}>
              <MobilePreview page={this.previewPages[this.curPreviewPageIndex]} class={styles.preview} />
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
      <div class={styles.rightPanel}>
        <div class={styles.mobileIntroRow}>
          <div class={styles.label}>MOBILE INTRO:</div>
          <ConfigTextArea
            placeholder='Mobile Intro'
            configField='mobile.introText'
            defaultValue={DEFAULT_CONFIG.mobile.introText}
            maxlength='100'
          ></ConfigTextArea>
        </div>
        <div class={styles.mobileFinalRow}>
          <div class={styles.label}>MOBILE FINAL:</div>
          <ConfigTextArea
            placeholder='Mobile Final'
            configField='mobile.welcomeText'
            defaultValue={DEFAULT_CONFIG.mobile.welcomeText}
            maxlength='100'
          ></ConfigTextArea>
        </div>
      </div>
    </div>
  );
}
