import { redraw } from 'mithril';
import { Unsubscribable, Subject, ReplaySubject } from 'rxjs';
import { isAndroid, isIOS } from '@gamechangerinteractive/xc-backend/utils';
import { MobilePreviewMode } from '../../../../common/common';
import { getPreviewMode, isPreview } from '../../../../common/utils/query';

export class OrientationService {
  private _canUseScreen: boolean;
  private _isMobile: boolean;
  private _isPortrait: boolean;
  private readonly _subject: Subject<boolean> = new ReplaySubject(1);
  private _previewMode: MobilePreviewMode;

  constructor() {
    this._previewMode = isPreview() ? getPreviewMode() : undefined;
    this._canUseScreen = navigator.userAgent.toLowerCase().includes('android');
    this.checkMobileChange();
  }

  public start() {
    if (!isNaN(this._previewMode)) {
      return;
    }

    if (!document.body) {
      window.addEventListener('load', this.start.bind(this), false);
      return;
    }

    if (this._canUseScreen) {
      this.checkOrientationChangeScreen();
      screen.orientation.addEventListener('change', this.checkOrientationChangeScreen.bind(this), false);
    } else {
      this.checkOrientationChange();
      window.addEventListener('resize', this.checkOrientationChange.bind(this), false);
    }
  }

  private checkMobileChange() {
    if (!isNaN(this._previewMode)) {
      this._isMobile = this._previewMode === MobilePreviewMode.MOBILE ? true : false;
    } else {
      this._isMobile = isAndroid() || isIOS();
      if (!this._isMobile) {
        this._isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      }
    }
  }

  private checkOrientationChange() {
    const isPortrait = window.innerWidth < window.innerHeight;
    if (this._isPortrait !== isPortrait) {
      this._isPortrait = isPortrait;
      this.checkMobileChange();
      this._subject.next(this._isPortrait);
      redraw();
    }
  }

  private checkOrientationChangeScreen() {
    const type: string = screen.orientation.type;
    const result = type.includes('portrait') || type === 'natural';

    if (this._isPortrait !== result) {
      this._isPortrait = result;
      this.checkMobileChange();
      this._subject.next(this._isPortrait);
      setTimeout(this.fixAndroidViewport.bind(this), 200);
      redraw();
    }
  }

  public get isPortrait(): boolean {
    return this._isPortrait;
  }

  public get isMobile(): boolean {
    return this._isMobile;
  }

  public subscribe(callback: (value: boolean) => void): Unsubscribable {
    return this._subject.subscribe(callback);
  }

  public fixAndroidViewport() {
    if (!isAndroid()) {
      return;
    }

    const metaViewport = document.querySelector('meta[name=viewport]');
    metaViewport.setAttribute(
      'content',
      `height=${window.innerHeight}px, width=${window.innerWidth}px, initial-scale=1.0, maximum-scale=1.0, user-scalable=0`,
    );
  }
}

export const orientation: OrientationService = new OrientationService();
