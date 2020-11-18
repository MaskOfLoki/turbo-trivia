import { MainScreen } from './index';
import m, { Vnode } from 'mithril';
import { Header } from './header';
import { isXeo } from '../../utils';
import cn from 'classnames';

export function template(this: MainScreen, vnode: Vnode) {
  return (
    <div class={this.styles.screen}>
      {!isXeo() && (
        <div class={this.styles.header}>
          <Header />
        </div>
      )}
      <div class={cn(this.styles.mainContent, { [this.styles.isXEO]: isXeo() })}>
        {vnode.children && vnode.children[0]}
      </div>
    </div>
  );
}
