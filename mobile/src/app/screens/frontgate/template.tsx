import m from 'mithril';
import { config } from '../../services/ConfigService';
import { FrontGateScreen } from './index';
import cn from 'classnames';
import { PhoneCodeSelect } from './phone-code-select';

export function template(this: FrontGateScreen) {
  return (
    <div class={this.styles.frontGate}>
      <div class={this.styles.phoneInputRow}>
        <div class={this.styles.groupUsername}>
          <input
            class={this.styles.input}
            placeholder='Username'
            value={this.userName}
            readonly={this.isSubmitted}
            oninput={(e) => (this.userName = e.target.value)}
          ></input>
          <div class={this.styles.line}></div>
          <div class={cn(this.styles.tooltip, { [this.styles.hasValue]: this.userName })}>User Name</div>
        </div>
        {!config.signup?.anonymous && (
          <div class={this.styles.phoneCodeAndNumber}>
            {!this.isSubmitted && (
              <div class={this.styles.groupPhoneCode}>
                <PhoneCodeSelect
                  phoneCode={this.phoneCode}
                  onchange={(value) => {
                    this.phoneCode = value;
                  }}
                />
                <div class={this.styles.tooltip}>Phone Code</div>
              </div>
            )}
            {!this.isSubmitted && (
              <div class={this.styles.groupPhone}>
                <div class={this.styles.phoneCode}>+{this.phoneCode}</div>
                <div class={this.styles.groupPhoneInput} id='groupPhone'>
                  <input
                    type='text'
                    class={this.styles.input}
                    readonly={this.isSubmitted}
                    placeholder='555-555-5555'
                    oninput={(e) => (this.phoneNumber = e.target.value)}
                  ></input>
                  <div class={this.styles.line}></div>
                  <div class={cn(this.styles.tooltip, { [this.styles.hasValue]: this.phoneNumber })}>Phone</div>
                </div>
              </div>
            )}
          </div>
        )}
        {!this.isSubmitted && !config.signup?.anonymous && config.optin?.enabled && (
          <div class={this.styles.optinCheckBox}>
            <input
              type='checkbox'
              class={this.styles.inputCheckbox}
              id='inputCheckboxOptin'
              checked={this.userOptin}
              oninput={() => (this.userOptin = !this.userOptin)}
            />
            <label class={this.styles.inputLabel} for='inputCheckboxOptin'>
              {config.optin?.message}
            </label>
          </div>
        )}
        {this.isSubmitted && (
          <div class={this.styles.verifyText} style={{ color: config.colors?.text }}>
            You will be sent a text containing a code to verify this device.
          </div>
        )}
        {this.isSubmitted && (
          <div class={this.styles.groupVerify}>
            <input
              class={this.styles.input}
              placeholder='Verification Code'
              oninput={(e) => (this.verificationCode = e.target.value)}
            ></input>
            <div class={this.styles.line}></div>
            <div class={this.styles.tooltip}>Code</div>
          </div>
        )}
      </div>
      <div class={this.styles.buttons}>
        {!config.signup?.anonymous && !this.isSubmitted && (
          <button
            class={cn(this.styles.sendSMSBtn, { disabled: !this.validated })}
            style={{ backgroundColor: config.colors?.button }}
            onclick={this.submitHandler.bind(this)}
          >
            Send SMS
          </button>
        )}
        {this.isSubmitted && (
          <button
            class={cn(this.styles.sendSMSBtn, { disabled: !this.verificationCode })}
            style={{ backgroundColor: config.colors?.button }}
            onclick={this.verifyHandler.bind(this)}
          >
            VERIFY
          </button>
        )}
        {config.signup?.anonymous && (
          <button
            class={this.styles.sendSMSBtn}
            style={{ backgroundColor: config.colors?.button }}
            onclick={this.nextHandler.bind(this)}
          >
            NEXT
          </button>
        )}
      </div>
      <div
        class={this.styles.logo}
        style={{
          backgroundImage: config.home.images?.sponsor ? `url(${config.home?.images?.sponsor})` : '',
        }}
      ></div>
    </div>
  );
}
