import { template } from './template';
import { MainboardPreviewPage, MobilePreviewPage } from '../../../../../../../common/common';
import { ClassComponent } from 'mithril';
import { isXeo } from '../../../../utils';

export class Preview implements ClassComponent {
  public previewPages = [];

  constructor() {
    if (isXeo()) {
      this.previewPages = [
        [MobilePreviewPage.WAIT, MobilePreviewPage.INTRO],
        [MobilePreviewPage.COUNTDOWN, MobilePreviewPage.RANK],
        [MobilePreviewPage.SHOW],
        [MobilePreviewPage.WAIT, MobilePreviewPage.INTRO],
        [MobilePreviewPage.COUNTDOWN, MobilePreviewPage.RANK],
        [MobilePreviewPage.SHOW],
        [MainboardPreviewPage.WAIT, MainboardPreviewPage.COUNTDOWN],
        [MainboardPreviewPage.INTRO, MainboardPreviewPage.SHOW],
        [MainboardPreviewPage.RANK],
      ];
    } else {
      this.previewPages = [
        [MobilePreviewPage.FRONTGATE, MobilePreviewPage.WAIT],
        [MobilePreviewPage.COUNTDOWN, MobilePreviewPage.INTRO],
        [MobilePreviewPage.SHOW, MobilePreviewPage.RANK],
        [MobilePreviewPage.FRONTGATE, MobilePreviewPage.WAIT],
        [MobilePreviewPage.COUNTDOWN, MobilePreviewPage.INTRO],
        [MobilePreviewPage.SHOW, MobilePreviewPage.RANK],
        [MainboardPreviewPage.WAIT, MainboardPreviewPage.COUNTDOWN],
        [MainboardPreviewPage.INTRO, MainboardPreviewPage.SHOW],
        [MainboardPreviewPage.RANK],
      ];
    }
  }

  public curPreviewPageIndex = 0;

  public view() {
    return template.call(this);
  }
}
