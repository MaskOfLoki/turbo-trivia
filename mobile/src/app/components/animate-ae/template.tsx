import m from 'mithril';
import XCAnimateAE from '.';
import styles from './module.scss';

export function template(this: XCAnimateAE) {
  const getSize = (initial) => {
    let size: number | string;
    if (typeof initial === 'number') {
      size = `${initial}px`;
    } else {
      size = initial || '100%';
    }
    return size;
  };

  const style = {
    // width: getSize(this.width),
    // height: getSize(this.height),
    overflow: 'hidden',
    margin: '0',
    outline: 'none',
  };

  return <div id={this.id} style={style} />;
}
