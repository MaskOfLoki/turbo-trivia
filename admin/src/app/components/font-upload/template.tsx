import { FontUpload } from './index';
import m from 'mithril';
import styles from './module.scss';
import cn from 'classnames';
import { isEmptyString } from '@gamechangerinteractive/xc-backend/utils';

export function template(this: FontUpload) {
  const imageStyle: Partial<CSSStyleDeclaration> = {};
  const isValue = !isEmptyString(this.value);

  imageStyle.backgroundImage = 'url(assets/icons/font.svg)';
  imageStyle.backgroundSize = '70% 70%';

  return (
    <div class={cn(styles.fontUpload, ...this.class.split(' '))} onclick={this.clickHandler.bind(this)}>
      <div class={styles.image} style={imageStyle}>
        {isValue && (
          <div class={styles.buttonDelete} onclick={this.buttonDeleteHandler.bind(this)}>
            X
          </div>
        )}
      </div>
    </div>
  );
}
