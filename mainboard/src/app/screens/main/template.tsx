import { MainScreen } from './index';
import styles from './module.scss';
import m, { Vnode } from 'mithril';

export function template(this: MainScreen, vnode: Vnode) {
  return <div class={styles.screen}>{vnode.children && vnode.children[0]}</div>;
}
