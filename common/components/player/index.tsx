import m, { ClassComponent } from 'mithril';

import { FileVideoPlayer } from './file-video-player';
import { getMediaType } from '../../../common/utils';
import { isIOS } from '@gamechangerinteractive/xc-backend/utils';
import { IPlayer } from './IPlayer';
import { FileAudioPlayer } from './file-audio-player';

export class Player implements ClassComponent {
  private _src: string;
  private _component;
  private _visibilityChangeHandler: VoidFunction = this.visibilityChangeHandler.bind(this);
  private _needPlay: boolean;
  private _player: IPlayer;

  constructor() {
    if (isIOS()) {
      document.addEventListener('visibilitychange', this._visibilityChangeHandler);
    }
  }

  private visibilityChangeHandler() {
    if (document.hidden) {
      // iOS autopause all videos on minimize, so we explicitly call pause method to make sure player internal state updated properly
      if (!this._player.paused || this._player.autoplay) {
        this._player.pause();
        this._needPlay = true;
      }
    } else if (this._needPlay) {
      setTimeout(() => this._player.play(), 100);
      this._needPlay = false;
    }
  }

  public onremove() {
    window.removeEventListener('visibilitychange', this._visibilityChangeHandler);
  }

  public view({ attrs }) {
    const cls = attrs.class;
    delete attrs.class;
    const playerAttrs = { ...attrs };
    playerAttrs.ref = (value) => {
      this._player = value;
      attrs.ref && attrs.ref(value);
    };

    if (this._src !== attrs.src) {
      this._src = attrs.src;
      const player = attrs.src ? getPlayer(attrs.src) : null;
      this._component = player ? m(player, playerAttrs) : null;
    }

    return <div class={cls}>{this._component}</div>;
  }
}

function getPlayer(url: string) {
  if (getMediaType(url) === 'video') {
    return FileVideoPlayer;
  } else if (getMediaType(url) == 'audio') {
    return FileAudioPlayer;
  }
}
