import { Vnode } from 'mithril';
import { ClassBaseComponent } from '../../../components/class-base';
import { orientation } from '../../../services/OrientationService';
import desktopStyles from './desktop.module.scss';
import mobileStyles from './mobile.module.scss';
import { template } from './template';

export interface IPhoneCodeSelectAttrs {
  phoneCode: string;
  onchange: (phoneCode: string) => void;
}

export class PhoneCodeSelect extends ClassBaseComponent<IPhoneCodeSelectAttrs> {
  public view({ attrs }: Vnode<IPhoneCodeSelectAttrs>) {
    return template.call(this, attrs);
  }

  public get styles() {
    if (orientation.isMobile) {
      return mobileStyles;
    } else {
      return desktopStyles;
    }
  }
}
