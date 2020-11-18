import { AdminScreen, DEFAULT_FIELDS } from './index';
import styles from './module.scss';
import m from 'mithril';
import { ConfigInput } from '../../../components/config-input';
import { ConfigTextArea } from '../../../components/config-textarea';
import { api } from '../../../services/api';
import { DEFAULT_CONFIG } from '../../../../../../common/common';
import { PresetSelect } from '../../../components/preset-select';
import { Slide } from '../../../components/slide';
import { ConfigSlide } from '../../../components/config-slide';
import { isXeo } from '../../../utils';
import cn from 'classnames';

export function template(this: AdminScreen) {
  return (
    <div class={styles.screen}>
      <div class={cn(styles.gameSettings, { [styles.isXeo]: isXeo() })}>
        <div class={styles.left}>
          <div class={styles.gameTitle}>
            <div class={styles.label}>GAME TITLE:</div>
            <ConfigInput
              placeholder='Game Title'
              configField='game.gameTitle'
              defaultValue={DEFAULT_CONFIG.game.gameTitle}
              maxlength='30'
            ></ConfigInput>
          </div>
          <div class={styles.postGameMessage}>
            <div class={styles.label}>POST-GAME MESSAGE:</div>
            <ConfigTextArea
              placeholder='Post Game Message'
              configField='game.postGameMessage'
              defaultValue={DEFAULT_CONFIG.game.postGameMessage}
              maxlength='100'
            ></ConfigTextArea>
          </div>
          <div class={styles.postGameMessage}>
            <div class={styles.label}>WINNING MESSAGE:</div>
            <ConfigTextArea
              placeholder='Winnning Message'
              configField='game.winningMessage'
              defaultValue={DEFAULT_CONFIG.game.winningMessage}
              maxlength='100'
            ></ConfigTextArea>
          </div>
          <div class={styles.postGameMessage}>
            <div class={styles.label}>LOSING MESSAGE:</div>
            <ConfigTextArea
              placeholder='Losing Message'
              configField='game.losingMessage'
              defaultValue={DEFAULT_CONFIG.game.losingMessage}
              maxlength='100'
            ></ConfigTextArea>
          </div>
        </div>
        {!isXeo() && (
          <div class={styles.middle}>
            <div class={styles.signUp}>
              <div class={styles.label}>SIGN UP:</div>
              <div class={styles.slider}>
                <ConfigSlide
                  class={styles.configSlide}
                  configField='signup.anonymous'
                  default={DEFAULT_CONFIG.signup.anonymous}
                ></ConfigSlide>
                <div class={styles.label}>Anonymous Login</div>
              </div>
            </div>
            <div class={styles.defaultUsernamePrefix}>
              <div class={styles.label}>DEFAULT USERNAME PREFIX:</div>
              <ConfigInput
                placeholder='Default Username Prefix'
                configField='game.defaultUserNamePrefix'
                defaultValue={DEFAULT_CONFIG.game.defaultUserNamePrefix}
              ></ConfigInput>
            </div>
            <div class={styles.signUpFields}>
              <div class={styles.label}>Fields (Required)</div>
              {DEFAULT_FIELDS.map((field) => (
                <input value={field} readonly='true' />
              ))}
              <div class={styles.label}>
                Fields
                <button class={styles.addFieldBtn} onclick={this.buttonAddFieldHandler.bind(this)}>
                  +
                </button>
              </div>
              {this.fields.map((field, index) => (
                <div class={styles.fieldRow}>
                  <input value={field.name} readonly='true' />
                  <button class={styles.fieldEditBtn} onclick={this.buttonEditFieldHandler.bind(this, index)} />
                  <button class={styles.fieldDeleteBtn} onclick={this.buttonRemoveFieldHandler.bind(this, index)} />
                </div>
              ))}
            </div>
          </div>
        )}
        {!isXeo() && (
          <div class={styles.right}>
            <div class={styles.optin}>
              <div class={styles.label}>OPT IN:</div>
              <div class={styles.slider}>
                <ConfigSlide
                  class={styles.configSlide}
                  configField='optin.enabled'
                  default={DEFAULT_CONFIG.optin.enabled}
                ></ConfigSlide>
                <div class={styles.label}>Enabled</div>
              </div>
              <ConfigTextArea
                placeholder='OptIn Message'
                configField='optin.message'
                defaultValue={DEFAULT_CONFIG.optin.message}
                maxlength='120'
              ></ConfigTextArea>
              <div class={styles.slider}>
                <ConfigSlide
                  class={styles.configSlide}
                  configField='optin.defaultChecked'
                  default={DEFAULT_CONFIG.optin.defaultChecked}
                ></ConfigSlide>
                <div class={styles.label}>Checked by default</div>
              </div>
            </div>
            <div class={styles.termsURL}>
              <div class={styles.label}>TERMS URL:</div>
              <ConfigInput placeholder='Terms URL' configField='game.termsUrl' type='url'></ConfigInput>
            </div>
            <div class={styles.privacyURL}>
              <div class={styles.label}>PRIVACY URL:</div>
              <ConfigInput placeholder='Privacy URL' configField='game.privacyUrl' type='url'></ConfigInput>
            </div>
            <button class={styles.credential} onclick={() => api.showLoginSettings(true)}>
              Credential
            </button>
          </div>
        )}
      </div>
      <div class={styles.publish}>
        <div class={styles.roundSelectRow}>
          <div class={styles.label}>Free Play:</div>
          <Slide
            selected={this.isFreePlay}
            onchange={() => {
              this.isFreePlay = !this.isFreePlay;
              if (this.isFreePlay) {
                this.isAutoRun = false;
              }
            }}
          ></Slide>
        </div>
        <div class={styles.roundSelectRow}>
          <div class={styles.label}>Auto Run:</div>
          <Slide
            selected={this.isAutoRun}
            onchange={() => {
              this.isAutoRun = !this.isAutoRun;
              if (this.isAutoRun) {
                this.isFreePlay = false;
              }
            }}
          ></Slide>
        </div>
        <div class={styles.presetRow}>
          <PresetSelect
            slot={this.slot}
            slots={this.slots}
            disableEdit={true}
            onChangeSlot={this.changeSlotHandler.bind(this)}
          ></PresetSelect>
        </div>
        {(this.isFreePlay || this.isAutoRun) && (
          <div class={styles.questionRevealRow}>
            <div class={styles.label}>Question Reveal Timer:</div>
            <input
              type='number'
              value={this.revealCountDown}
              oninput={(e) => (this.revealCountDown = parseInt(e.target.value))}
              placeholder='Input Time (sec)'
            ></input>
          </div>
        )}
        {(this.isFreePlay || this.isAutoRun) && (
          <div class={styles.questionIntermissionRow}>
            <div class={styles.label}>Question Intermission Timer:</div>
            <input
              type='number'
              value={this.intermissionCountDown}
              oninput={(e) => (this.intermissionCountDown = parseInt(e.target.value))}
              placeholder='Input Time (sec)'
            ></input>
          </div>
        )}
        <button class={styles.publishBtn} onclick={this.publishHandler.bind(this)}>
          Publish
        </button>
      </div>
    </div>
  );
}
