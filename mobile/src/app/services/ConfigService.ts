import { api } from './api';
import { orientation } from './OrientationService';
import { IConfig, fillDefaultConfig } from '../../../../common/common';
import { Subject } from 'rxjs';
import { getColor } from '../../../../common/utils';
import { redraw } from 'mithril';
import { toPromise } from '../utils';
import { isEmptyString } from '@gamechangerinteractive/xc-backend/utils';

class ConfigService {
  private _config: IConfig = fillDefaultConfig();
  private _subject: Subject<IConfig> = new Subject();
  private _styleFont: HTMLElement;
  private _font: string;
  private _customFont: string;

  public async init(): Promise<IConfig> {
    orientation.subscribe(this.orientationHandler.bind(this));
    api.config.subscribe(this.configHandler.bind(this));
    return toPromise(api.config);
  }

  private orientationHandler() {
    this.refreshBackground();
  }

  private configHandler(value: IConfig) {
    this._config = value;
    this.updateFont(value.home.font, value.home.customFont);
    this.preprocessColors();
    this.refreshBackground();
    this._subject.next(value);
    redraw();
  }

  private refreshBackground() {
    const value = this._config;

    let hasBackground = false;

    const background = orientation.isMobile ? value.mobile?.background : value.desktop?.background;

    if (!isEmptyString(background)) {
      document.body.style.backgroundImage = `url(${background})`;
      hasBackground = true;
    } else {
      document.body.style.backgroundImage = '';
    }

    if (value.home.colors.background) {
      if (typeof value.home.colors.background === 'string' && value.home.colors.background.startsWith('#')) {
        document.body.style.backgroundColor = value.home.colors.background;
      } else {
        document.body.style.backgroundImage += `${hasBackground ? ', ' : ''}${value.home.colors.background.toString()}`;
      }
    }
  }

  private updateFont(font: string, customFont: string) {
    if (this._font === font && this._customFont === customFont) {
      return;
    }

    this._font = font;
    this._customFont = customFont;

    if (this._font !== 'Custom') {
      document.body.style.fontFamily = this._font;
      return;
    }

    if (this._styleFont) {
      document.head.removeChild(this._styleFont);
      this._styleFont = undefined;
    }

    if (isEmptyString(this._customFont)) {
      document.body.style.fontFamily = '';
      return;
    }

    this._styleFont = document.createElement('style');
    this._styleFont.appendChild(
      document.createTextNode(`
            @font-face {
                font-family: Turbo Trivia Custom Font;
                src: url(${this._customFont});
            }`),
    );

    document.head.appendChild(this._styleFont);
    document.body.style.fontFamily = 'Turbo Trivia Custom Font';
  }

  public get home() {
    return this._config.home;
  }

  public get game() {
    return this._config.game;
  }

  public get mobile() {
    return this._config.mobile;
  }

  public get desktop() {
    return this._config.desktop;
  }

  public get misc() {
    return this._config.misc;
  }

  public get colors() {
    return this._config.home.colors;
  }

  public get signup() {
    return this._config.signup;
  }

  public get optin() {
    return this._config.optin;
  }

  private preprocessColors(): void {
    for (const scope of Object.keys(this._config)) {
      const obj = this._config[scope];
      if (typeof obj === 'object' && obj.colors) {
        for (const color of Object.keys(obj.colors)) {
          if (typeof obj.colors[color] === 'object') {
            obj.colors[color].toString = getColor.bind(undefined, obj.colors[color]);
          }
        }
      }
    }
  }
}

export const config: ConfigService = new ConfigService();
