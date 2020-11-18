import { LogosColorsScreen } from './index';
import styles from './module.scss';
import m from 'mithril';
import { ConfigImageFileUpload } from '../../../components/config-image-file-upload';
import { ConfigColorPicker } from '../../../components/config-color-picker';
import { DEFAULT_CONFIG } from '../../../../../../common/common';
import { ConfigFont } from '../../../components/config-font';
import { Preview } from './preview';

export function template(this: LogosColorsScreen) {
  return (
    <div class={styles.screen}>
      <div class={styles.leftPanel}>
        <div class={styles.logoRow}>
          <div class={styles.teamLogo}>
            <div class={styles.label}>TEAM LOGO:</div>
            <div class={styles.upload}>
              <ConfigImageFileUpload
                addButtonText='Change'
                changeButtonText='Change'
                configField='home.images.team'
                resolutionText='Image: <br/>Scale (10 x 6) <br/>Suggested Resolution (400 x 240) <br/>Max file Size (25MB)'
              ></ConfigImageFileUpload>
            </div>
          </div>
          <div class={styles.sponsorLogo}>
            <div class={styles.label}>SPOSOR LOGO:</div>
            <div class={styles.upload}>
              <ConfigImageFileUpload
                addButtonText='Change'
                changeButtonText='Change'
                configField='home.images.sponsor'
                resolutionText='Image: <br/>Scale (10 x 6) <br/>Suggested Resolution (400 x 240) <br/>Max file Size (25MB)'
              ></ConfigImageFileUpload>
            </div>
          </div>
        </div>
        <div class={styles.fontTypeRow}>
          <ConfigFont configField='home.font' defaultValue={DEFAULT_CONFIG.home.font}></ConfigFont>
        </div>
      </div>
      <div class={styles.middlePanel}>
        <Preview></Preview>
      </div>
      <div class={styles.rightPanel}>
        <div class={styles.label}>UI COLOR SETTINGS:</div>
        <div class={styles.colorPanel}>
          <div class={styles.colorItemRow}>
            <div class={styles.colorItemText}>BACKGROUND COLOR:</div>
            <div class={styles.space}></div>
            <div class={styles.colorItem}>
              <ConfigColorPicker
                configField='home.colors.background'
                defaultColor={DEFAULT_CONFIG.home.colors.background}
              ></ConfigColorPicker>
            </div>
          </div>
          <div class={styles.colorItemRow}>
            <div class={styles.colorItemText}>BUTTON COLOR:</div>
            <div class={styles.space}></div>
            <div class={styles.colorItem}>
              <ConfigColorPicker
                configField='home.colors.button'
                defaultColor={DEFAULT_CONFIG.home.colors.button}
              ></ConfigColorPicker>
            </div>
          </div>
          <div class={styles.colorItemRow}>
            <div class={styles.colorItemText}>GAMIFICATION COLOR:</div>
            <div class={styles.space}></div>
            <div class={styles.colorItem}>
              <ConfigColorPicker
                configField='home.colors.gamification'
                defaultColor={DEFAULT_CONFIG.home.colors.gamification}
              ></ConfigColorPicker>
            </div>
          </div>
          <div class={styles.colorItemRow}>
            <div class={styles.colorItemText}>HEADER COLOR:</div>
            <div class={styles.space}></div>
            <div class={styles.colorItem}>
              <ConfigColorPicker
                configField='home.colors.header'
                defaultColor={DEFAULT_CONFIG.home.colors.header}
              ></ConfigColorPicker>
            </div>
          </div>
          <div class={styles.colorItemRow}>
            <div class={styles.colorItemText}>PRIMARY COLOR:</div>
            <div class={styles.space}></div>
            <div class={styles.colorItem}>
              <ConfigColorPicker
                configField='home.colors.primary'
                defaultColor={DEFAULT_CONFIG.home.colors.primary}
              ></ConfigColorPicker>
            </div>
          </div>
          <div class={styles.colorItemRow}>
            <div class={styles.colorItemText}>TEXT COLOR:</div>
            <div class={styles.space}></div>
            <div class={styles.colorItem}>
              <ConfigColorPicker
                configField='home.colors.text'
                defaultColor={DEFAULT_CONFIG.home.colors.text}
              ></ConfigColorPicker>
            </div>
          </div>
          <div class={styles.colorItemRow}>
            <div class={styles.colorItemText}>CORRECT COLOR:</div>
            <div class={styles.space}></div>
            <div class={styles.colorItem}>
              <ConfigColorPicker
                configField='home.colors.correct'
                defaultColor={DEFAULT_CONFIG.home.colors.correct}
              ></ConfigColorPicker>
            </div>
          </div>
          <div class={styles.colorItemRow}>
            <div class={styles.colorItemText}>INCORRECT COLOR:</div>
            <div class={styles.space}></div>
            <div class={styles.colorItem}>
              <ConfigColorPicker
                configField='home.colors.incorrect'
                defaultColor={DEFAULT_CONFIG.home.colors.incorrect}
              ></ConfigColorPicker>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
