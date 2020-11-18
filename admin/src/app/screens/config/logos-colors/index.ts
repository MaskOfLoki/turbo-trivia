import { ClassComponent } from 'mithril';
import { PopupManager } from '../../../../../../common/popups/PopupManager';
import { Preview } from './preview';
import { template } from './template';

export class LogosColorsScreen implements ClassComponent {
  public view(vnode) {
    return template.call(this, vnode);
  }

  public async previewHandler() {
    await PopupManager.show(Preview);
  }
}
