import m from 'mithril';
import { IMultipleChoiceSignupField, SignupFieldType } from '../../../../../common/common';
import { config } from '../../services/ConfigService';
import { AdditionInfoScreen } from './index';
import cn from 'classnames';

export function template(this: AdditionInfoScreen) {
  return (
    <div class={this.styles.additionInfo}>
      <div class={this.styles.inputRow}>
        <div class={this.styles.title}>Just a few more questions</div>
        {this.fields.map((field) => (
          <div class={this.styles.groupCommon}>
            <div class={this.styles.label}>{field.name}</div>
            {field.type === SignupFieldType.STRING && (
              <div class={this.styles.groupLine}>
                <input
                  class={this.styles.input}
                  maxlength='100'
                  value={this.values[field.name]}
                  oninput={(e) => (this.values[field.name] = e.target.value)}
                />
                <div class={this.styles.line}></div>
                <div class={this.styles.tooltip}>{field.name}</div>
              </div>
            )}
            {field.type === SignupFieldType.MULTIPLE_CHOICE && (
              <div class={this.styles.groupSelectLine}>
                <select value={this.values[field.name]} onchange={(e) => (this.values[field.name] = e.target.value)}>
                  {(field as IMultipleChoiceSignupField).options.map((value, index) => (
                    <option
                      value={value}
                      selected={
                        this.values[field.name] === value || (this.values[field.name] === undefined && index === 0)
                      }
                    >
                      {value}
                    </option>
                  ))}
                </select>
                <div class={this.styles.line}></div>
                <div class={this.styles.tooltip}>{field.name}</div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div class={this.styles.buttons}>
        <button
          class={cn(this.styles.nextBtn, { disabled: !this.isSaveAvailable })}
          style={{ backgroundColor: config.colors?.button }}
          onclick={this.buttonSaveHandler.bind(this)}
        >
          NEXT
        </button>
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
