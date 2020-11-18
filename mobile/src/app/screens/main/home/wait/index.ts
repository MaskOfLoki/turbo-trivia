import { ClassBaseComponent } from '../../../../components/class-base';
import { template } from './template';
import { orientation } from '../../../../services/OrientationService';
import { BaseScreen } from '../../base';
import desktopStyles from './desktop.module.scss';
import mobileStyles from './mobile.module.scss';

export class WaitScreen extends BaseScreen {
  public view() {
    return template.call(this);
  }

  public get styles() {
    if (orientation.isMobile) {
      return mobileStyles;
    } else {
      return desktopStyles;
    }
  }
}
