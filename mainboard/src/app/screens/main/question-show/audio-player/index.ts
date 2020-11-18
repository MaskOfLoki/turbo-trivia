import { ClassBaseComponent } from '../../../../components/class-base';
import { template } from './template';
import styles from './module.scss';
import { Vnode } from 'mithril';
import { IMediaTimeLineInfo } from '../../../../../../../common/common';
import { IPlayer } from '../../../../../../../common/components/player/IPlayer';

export interface IAudioPlayerAttrs {
  src: string;
  ref: (value: AudioPlayer) => void;
}

export class AudioPlayer extends ClassBaseComponent<IAudioPlayerAttrs> {
  private _audioPlayer: IPlayer;
  public src: string;
  public mediaTimeLine: IMediaTimeLineInfo = null;
  private _isMediaLoaded: boolean;

  public oninit(vnode: Vnode<IAudioPlayerAttrs, this>) {
    if (vnode.attrs.src && this.src != vnode.attrs.src) {
      this.src = vnode.attrs.src;
    }

    if (vnode.attrs.ref) {
      vnode.attrs.ref(this);
    }
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
    this._audioPlayer.muted = !this.isMuted;
  }

  public buttonPlayHandler() {
    this._audioPlayer.play();
  }

  public setAudioPlayer(value: IPlayer) {
    this._audioPlayer = value;
  }

  public get isPaused(): boolean {
    return this._audioPlayer?.paused;
  }

  public get isMuted(): boolean {
    return this._audioPlayer?.muted;
  }

  public view() {
    return template.call(this);
  }

  public get styles() {
    return styles;
  }

  public onremove() {
    this._audioPlayer?.destroy();
    super.onremove();
  }
}
