import { VnodeDOM } from 'mithril';
import { delay } from '../../../utils';
import { ClassBaseComponent } from '../../../components/class-base';

import styles from './module.scss';

export abstract class BaseScreen<T = {}> extends ClassBaseComponent<T> {
  public oncreate(vnode: VnodeDOM) {
    super.oncreate(vnode);
    this._element.classList.add(styles.baseScreen);

    // delay(1) is used to allow the component to fully render on the screen before the transition is attached
    delay(1).then(() => {
      this._element.classList.add(styles.slideIn);
      this._element.ontransitionend = () => {
        this._element.ontransitionend = null;
      };
    });
  }

  public onbeforeremove() {
    this._element.classList.remove(styles.slideIn);
    this._element.classList.add(styles.slideOut);

    return new Promise((res) => {
      this._element.ontransitionend = () => {
        res();
        this._element.ontransitionend = null;
      };
    });
  }
}
