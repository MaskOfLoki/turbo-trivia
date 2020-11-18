import { ClassComponent, redraw, Vnode } from 'mithril';
import { Unsubscribable, of } from 'rxjs';
import { api } from '../../services/api';

export interface IConfigControlAttrs {
  configField: any;
  namespace?: string;
}

export abstract class ConfigControl implements ClassComponent<IConfigControlAttrs> {
  protected _namespace = 'common';
  protected _configField: string;
  protected _configValue: any;
  private _subscription: Unsubscribable;

  protected valueChangeHandler(value: any) {
    this._configValue = value;
    api.setConfigField(this._configField, value, this._namespace);
  }

  public onremove() {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }

  public view({ attrs }: Vnode<IConfigControlAttrs>) {
    if (attrs.namespace == null) {
      attrs.namespace = 'common';
    }

    if (this._configField !== attrs.configField || this._namespace !== attrs.namespace) {
      this._configField = attrs.configField;
      this._namespace = attrs.namespace;

      if (this._subscription) {
        this._subscription.unsubscribe();
      }

      const observable = api.configField<any>(this._configField, this._namespace);

      this._subscription = observable.subscribe((value) => {
        this._configValue = value ?? null;
      });
    }

    return this.template(attrs);
  }

  protected get value(): any {
    return this._configValue;
  }

  abstract template(attrs?: IConfigControlAttrs): any;
}
