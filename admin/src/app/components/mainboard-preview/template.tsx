import { MainboardPreview, IMainboardPreviewAttrs } from './index';
import styles from './module.scss';
import m, { Vnode } from 'mithril';
import cn from 'classnames';

export function template(this: MainboardPreview, vnode: Vnode<IMainboardPreviewAttrs>) {
  return (
    <div class={cn(styles.preview, ...(vnode.attrs.class || '').split(' '))}>
      <iframe src={this.url} />
    </div>
  );
}
