import { DesktopScreen } from './index';
import styles from './module.scss';
import m from 'mithril';
import { ConfigImageFileUpload } from '../../../components/config-image-file-upload';
import { ConfigTextArea } from '../../../components/config-textarea';
import { DEFAULT_CONFIG, MobilePreviewMode } from '../../../../../../common/common';
import { MobilePreview } from '../../../components/mobile-preview';
import cn from 'classnames';

export function template(this: DesktopScreen) {
  return (
    <div class={styles.screen}>
      <div class={styles.leftPanel}>
        <div class={styles.desktopBackground}>
          <div class={styles.label}>DESKTOP BACKGROUND:</div>
          <div class={styles.upload}>
            <ConfigImageFileUpload
              addButtonText='Change'
              changeButtonText='Change'
              configField='desktop.background'
              resolutionText='Image: <br/>Scale (16 x 9) <br/>Suggested Resolution (1920 x 1080) <br/>Max file Size (25MB)'
            ></ConfigImageFileUpload>
          </div>
        </div>
        <div class={styles.desktopPreview}>
          <div class={styles.label}>DESKTOP PREVIEW:</div>
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
              <MobilePreview
                page={this.previewPages[this.curPreviewPageIndex]}
                class={styles.preview}
                mode={MobilePreviewMode.DESKTOP}
              />
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
        <div class={styles.desktopIntroRow}>
          <div class={styles.label}>DESKTOP INTRO:</div>
          <ConfigTextArea
            placeholder='Desktop Intro'
            configField='desktop.introText'
            defaultValue={DEFAULT_CONFIG.desktop.introText}
            maxlength='100'
          ></ConfigTextArea>
        </div>
        <div class={styles.desktopFinalRow}>
          <div class={styles.label}>DESKTOP FINAL:</div>
          <ConfigTextArea
            placeholder='Desktop Final'
            configField='desktop.welcomeText'
            defaultValue={DEFAULT_CONFIG.desktop.welcomeText}
            maxlength='100'
          ></ConfigTextArea>
        </div>
      </div>
    </div>
  );
}
