import { EditSignupFieldPopup } from './index';
import styles from './module.scss';
import m from 'mithril';
import cn from 'classnames';
import { SignupFieldType } from '../../../../../../common/common';
import { Input } from '../../input';

export function template(this: EditSignupFieldPopup) {
  return (
    <div class={styles.popup}>
      <div class={styles.header}>
        <div class={styles.title}>FIELD</div>
        <div class={styles.space}></div>
        <button class={styles.saveBtn} onclick={this.buttonSaveHandler.bind(this)}>
          SAVE
        </button>
        <div class={styles.closeBtn} onclick={() => this.close()}></div>
      </div>
      <div class={styles.content}>
        <div class={styles.groupButtons}>
          <button
            class={cn({ [styles.selected]: this.field.type === SignupFieldType.STRING })}
            onclick={this.fieldTypeChangeHandler.bind(this, SignupFieldType.STRING)}
          >
            FILL IN
          </button>
          <button
            class={cn({ [styles.selected]: this.field.type === SignupFieldType.MULTIPLE_CHOICE })}
            onclick={this.fieldTypeChangeHandler.bind(this, SignupFieldType.MULTIPLE_CHOICE)}
          >
            CHOICES
          </button>
        </div>
        <div class={styles.divider}></div>
        <div class={styles.mainContainer}>
          <Input
            value={this.field.name}
            oninput={(e) => (this.field.name = e.target.value)}
            placeholder='NAME'
            maxlength='120'
          />
          <div class={cn(styles.groupChoices, { [styles.disabled]: this.field.type === SignupFieldType.STRING })}>
            <div class={styles.choiceHeader}>
              <span>Choice</span>
              {this.options.length < 5 && (
                <button class='outline' onclick={this.buttonAddChoiceHandler.bind(this)}>
                  +
                </button>
              )}
            </div>
            {this.options.map((option, index) => (
              <div class={styles.row}>
                <div class={styles.labelIndex}>{(index + 1).toString().padStart(2, '0')}</div>
                <Input
                  maxlength='20'
                  placeholder='Choice'
                  value={option}
                  oninput={(e) => (this.options[index] = e.target.value)}
                />
                {this.options.length > 2 && (
                  <button
                    class={`${styles.deleteButton} outline`}
                    onclick={this.buttonRemoveChoiceHandler.bind(this, index)}
                  />
                )}
                {this.options.length < 3 && <div class={styles.spacer} />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
