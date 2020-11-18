import { Vnode } from 'mithril';
import { ClassBaseComponent } from '../../components/class-base';
import { orientation } from '../../services/OrientationService';
import { template } from './template';
import desktopStyles from './desktop.module.scss';
import mobileStyles from './mobile.module.scss';

export class MainScreen extends ClassBaseComponent {
  public view(vnode: Vnode) {
    return template.call(this, vnode);
  }

  public get styles() {
    if (orientation.isMobile) {
      return mobileStyles;
    } else {
      return desktopStyles;
    }
  }
}
