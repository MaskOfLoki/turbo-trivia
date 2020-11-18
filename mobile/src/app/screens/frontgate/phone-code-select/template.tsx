import { PhoneCodeSelect, IPhoneCodeSelectAttrs } from './index';
import m from 'mithril';
import { countries } from './countries';
import { config } from '../../../services/ConfigService';

export function template(this: PhoneCodeSelect, { phoneCode, onchange }: IPhoneCodeSelectAttrs) {
  return (
    <div class={this.styles.control}>
      <select onchange={(e) => onchange(countries[e.target.selectedIndex][1])}>
        {countries.map(([name, phone]) => (
          <option selected={phone === phoneCode}>{name}</option>
        ))}
      </select>
    </div>
  );
}
