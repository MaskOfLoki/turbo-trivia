import { ClassComponent } from 'mithril';
import { MainboardPreviewPage } from '../../../../../../common/common';
import { template } from './template';

export class MainboardScreen implements ClassComponent {
  public previewPages: MainboardPreviewPage[] = [
    MainboardPreviewPage.WAIT,
    MainboardPreviewPage.COUNTDOWN,
    MainboardPreviewPage.INTRO,
    MainboardPreviewPage.SHOW,
    MainboardPreviewPage.RANK,
  ];
  public curPreviewPageIndex = 0;
  public view(vnode) {
    return template.call(this, vnode);
  }
}
