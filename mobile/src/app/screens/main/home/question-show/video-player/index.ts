import { ClassBaseComponent } from '../../../../../components/class-base';
import { orientation } from '../../../../../services/OrientationService';
import { template } from './template';
import desktopStyles from './desktop.module.scss';
import mobileStyles from './mobile.module.scss';
import { Vnode } from 'mithril';
import { IMediaTimeLineInfo } from '../../../../../../../../common/common';
import { IPlayer } from '../../../../../../../../common/components/player/IPlayer';

export interface IVideoPlayerAttrs {
  src: string;
  isFullWidth: boolean;
  ref: (value: VideoPlayer) => void;
}

export class VideoPlayer extends ClassBaseComponent<IVideoPlayerAttrs> {
  private _videoPlayer: IPlayer;
  public src: string;
  public mediaTimeLine: IMediaTimeLineInfo = null;
  private _isMediaLoaded: boolean;
  private _isFullWidth = false;

  public oninit(vnode: Vnode<IVideoPlayerAttrs, this>) {
    if (vnode.attrs.src && this.src != vnode.attrs.src) {
      this.src = vnode.attrs.src;
    }

    if (vnode.attrs.ref) {
      vnode.attrs.ref(this);
    }

    this.onbeforeupdate(vnode);
  }

  public onbeforeupdate(vnode: Vnode<IVideoPlayerAttrs, this>) {
    this._isFullWidth = vnode.attrs.isFullWidth;
  }

  public onLoadMedia(duration: number) {
    this._isMediaLoaded = true;
    this.mediaTimeLine = {
      duration: duration,
      currentTime: 0,
    };
  }

  public get isMediaLoaded(): boolean {
    return this._isMediaLoaded;
  }

  public get progressPercent(): number {
    if (this.mediaTimeLine) {
      return Math.floor((this.mediaTimeLine.currentTime * 100) / this.mediaTimeLine.duration);
    } else {
      return 0;
    }
  }

  public muteHandler() {
    this._videoPlayer.muted = !this.isMuted;
  }

  public buttonPlayHandler() {
    this._videoPlayer.play();
  }

  public setVideoPlayer(value: IPlayer) {
    this._videoPlayer = value;
  }

  public get isPaused(): boolean {
    return this._videoPlayer?.paused;
  }

  public get isMuted(): boolean {
    return this._videoPlayer?.muted;
  }

  public get isFullWidth(): boolean {
    return this._isFullWidth;
  }

  public view() {
    return template.call(this);
  }

  public get styles() {
    if (orientation.isMobile) {
      return mobileStyles;
    } else {
      return desktopStyles;
    }
  }

  public onremove() {
    this._videoPlayer?.destroy();
    super.onremove();
  }
}
