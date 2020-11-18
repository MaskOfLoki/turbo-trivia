import { MainboardScreen } from './index';
import styles from './module.scss';
import m from 'mithril';
import { ConfigImageFileUpload } from '../../../components/config-image-file-upload';
import { ConfigTextArea } from '../../../components/config-textarea';
import { DEFAULT_CONFIG } from '../../../../../../common/common';
import cn from 'classnames';
import { MainboardPreview } from '../../../components/mainboard-preview';

export function template(this: MainboardScreen) {
  return (
    <div class={styles.screen}>
      <div class={styles.leftPanel}>
        <div class={styles.mainboardBackground}>
          <div class={styles.label}>MAINBOARD BACKGROUND:</div>
          <div class={styles.upload}>
            <ConfigImageFileUpload
              addButtonText='Change'
              changeButtonText='Change'
              configField='mainboard.background'
              resolutionText='Image: <br/>Scale (16 x 9) <br/>Suggested Resolution (1920 x 1080) <br/>Max file Size (25MB)'
            ></ConfigImageFileUpload>
          </div>
        </div>
        <div class={styles.mainboardPreview}>
          <div class={styles.label}>MAINBOARD PREVIEW:</div>
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
              <MainboardPreview page={this.previewPages[this.curPreviewPageIndex]} class={styles.preview} />
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
        <div class={styles.mainboardIntroRow}>
          <div class={styles.label}>MAINBOARD INTRO:</div>
          <ConfigTextArea
            placeholder='Mainboard Intro'
            configField='mainboard.introText'
            defaultValue={DEFAULT_CONFIG.mainboard.introText}
            maxlength='100'
          ></ConfigTextArea>
        </div>
        <div class={styles.mainboardFinalRow}>
          <div class={styles.label}>MAINBOARD FINAL:</div>
          <ConfigTextArea
            placeholder='Mainboard Final'
            configField='mainboard.welcomeText'
            defaultValue={DEFAULT_CONFIG.mainboard.welcomeText}
            maxlength='100'
          ></ConfigTextArea>
        </div>
      </div>
    </div>
  );
}
