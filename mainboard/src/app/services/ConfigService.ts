import { api } from './api';
import { IConfig, fillDefaultConfig } from '../../../../common/common';
import { Subject } from 'rxjs';
import { getColor } from '../../../../common/utils';
import { isEmptyString } from '@gamechangerinteractive/xc-backend/utils';
import { toPromise } from '../utils';

class ConfigService {
  private _config: IConfig = fillDefaultConfig();
  private _subject: Subject<IConfig> = new Subject();
  private _styleFont: HTMLElement;
  private _font: string;
  private _customFont: string;

  public init() {
    api.config.subscribe(this.configHandler.bind(this));
    return toPromise(api.config);
  }

  private configHandler(value: IConfig) {
    this._config = value;
    this.updateFont(value.home.font, value.home.customFont);
    this.preprocessColors();
    this.refreshBackground();
    this._subject.next(value);
  }

  private refreshBackground() {
    const value = this._config;

    let hasBackground = false;

    if (!isEmptyString(value.mainboard?.background)) {
      document.body.style.backgroundImage = `url(${value.mainboard?.background})`;
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
    if (this._font === font && this._customFont == customFont) {
      return;
    }

    this._font = font;
    this._customFont = customFont;

    if (this._font != 'Custom') {
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

  private preprocessColors(): void {
    for (const scope of Object.keys(this._config)) {
      const obj = this._config[scope];
      if (typeof obj === 'object' && obj.colors) {
        for (const color of Object.keys(obj.colors)) {
          obj.colors[color] = getColor(obj.colors[color]);
        }
      }
    }
  }

  public get home() {
    return this._config.home;
  }

  public get game() {
    return this._config.game;
  }

  public get misc() {
    return this._config.misc;
  }

  public get mainboard() {
    return this._config.mainboard;
  }

  public get colors() {
    return this._config.home.colors;
  }
}

export const config: ConfigService = new ConfigService();
