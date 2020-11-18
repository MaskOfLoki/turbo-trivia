import m, { ClassComponent, VnodeDOM } from 'mithril';
import { IPlayer, IPlayerAttrs } from '../IPlayer';
import { isPreview } from '../../../utils/query';

export class FileVideoPlayer implements ClassComponent<IPlayerAttrs>, IPlayer {
  protected _element: HTMLVideoElement;
  private _duration: number;
  private _onduration: (value: number) => void;
  private _ontoggleplay: (value: boolean) => void;
  private _ontimeupdate: (duration: number, currentTime: number) => void;

  public oncreate({ dom, attrs }: VnodeDOM<IPlayerAttrs>) {
    this._element = dom as HTMLVideoElement;
    this._element.addEventListener('loadeddata', this.loadedDataHandler.bind(this));
    this._element.addEventListener('play', this.playHandler.bind(this));
    this._element.addEventListener('pause', this.pauseHandler.bind(this));
    this._element.addEventListener('canplay', this.canplayHandler.bind(this));
    this._element.addEventListener('timeupdate', this.timeUpdateHandler.bind(this));
    this._element.addEventListener('ended', this.endedHandler.bind(this));

    if (attrs.ref) {
      attrs.ref(this);
    }
  }

  private playHandler() {
    if (this._ontoggleplay) {
      this._ontoggleplay(true);
    }
  }

  private pauseHandler() {
    if (this._ontoggleplay) {
      this._ontoggleplay(false);
    }
  }

  public timeUpdateHandler() {
    if (this._ontimeupdate) {
      this._ontimeupdate(this.duration, this.position);
    }
  }

  private canplayHandler() {
    if (isPreview()) {
      this.muted = true;
    }
  }

  private loadedDataHandler() {
    if (this._duration === this.duration || isNaN(this.duration)) {
      return;
    }

    this._duration = this.duration;

    if (this._onduration) {
      this._onduration(this._duration);
    }
  }

  private endedHandler() {
    this._element?.pause();
    this._element.currentTime = 0;

    if (this._ontoggleplay) {
      this._ontoggleplay(false);
    }
  }

  public play(): void {
    this._element?.play();
  }

  public pause(): void {
    this._element?.pause();
  }

  public seek(milliseconds: number) {
    if (this._element) {
      this._element.currentTime = Math.round(milliseconds * 0.001);
    }
  }

  public destroy() {
    this.src = '';
    this.muted = true;
    this._element?.pause();
  }

  public view({ attrs }) {
    attrs = { ...attrs };
    attrs.preload = '';
    attrs.playsinline = '';
    this._onduration = attrs.onduration;
    this._ontoggleplay = attrs.ontoggleplay;
    this._ontimeupdate = attrs.ontimeupdate;

    attrs.style = Object.assign(
      {
        width: '100%',
        maxHeight: '100%',
      },
      attrs.style ?? {},
    );

    return m('video', attrs);
  }

  public get muted(): boolean {
    return this._element?.muted;
  }

  public set muted(value: boolean) {
    this._element.muted = value;
  }

  public get paused(): boolean {
    return this._element?.paused;
  }

  public set autoplay(value: boolean) {
    this._element.autoplay = value;
  }

  public get autoplay(): boolean {
    return this._element?.autoplay;
  }

  public set src(value: string) {
    this._element.src = value;
  }

  public get src(): string {
    return this._element?.src;
  }

  public get duration(): number {
    return this._element.duration * 1000;
  }

  public get position(): number {
    return this._element.currentTime * 1000;
  }
}
