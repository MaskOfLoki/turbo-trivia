import { HomeScreen } from './index';
import styles from './module.scss';
import m, { Vnode } from 'mithril';

export function template(this: HomeScreen, vnode: Vnode) {
  return (
    <div class={styles.screen}>
      <div class={styles.content}>{vnode.children && vnode.children[0]}</div>
    </div>
  );
}
