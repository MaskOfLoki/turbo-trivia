import { ClassComponent, Vnode } from 'mithril';
import { template } from './template';

export interface IHighlightedInputAttrs {
  value: string;
  onchange: (value: string) => void;
  tooltip: string;
  readonly: boolean;
  onenter: VoidFunction;
  class: string;
  type: string;
  inputStyle: Partial<CSSStyleDeclaration>;
  placeholder: string;
}

export class HighlightedInput implements ClassComponent<IHighlightedInputAttrs> {
  public view({ attrs }: Vnode<IHighlightedInputAttrs>) {
    return template.call(this, attrs);
  }
}
