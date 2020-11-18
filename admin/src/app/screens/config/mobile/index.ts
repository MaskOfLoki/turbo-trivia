import { ClassComponent } from 'mithril';
import { MobilePreviewPage } from '../../../../../../common/common';
import { isXeo } from '../../../utils';
import { template } from './template';

export class MobileScreen implements ClassComponent {
  public previewPages: MobilePreviewPage[] = [];
  public curPreviewPageIndex = 0;

  constructor() {
    if (isXeo()) {
      this.previewPages = [
        MobilePreviewPage.WAIT,
        MobilePreviewPage.COUNTDOWN,
        MobilePreviewPage.INTRO,
        MobilePreviewPage.SHOW,
        MobilePreviewPage.RANK,
      ];
    } else {
      this.previewPages = [
        MobilePreviewPage.FRONTGATE,
        MobilePreviewPage.WAIT,
        MobilePreviewPage.COUNTDOWN,
        MobilePreviewPage.INTRO,
        MobilePreviewPage.SHOW,
        MobilePreviewPage.RANK,
      ];
    }
  }

  public view(vnode) {
    return template.call(this, vnode);
  }
}
