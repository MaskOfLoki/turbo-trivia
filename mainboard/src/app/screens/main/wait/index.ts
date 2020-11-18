import { template } from './template';
import { ClassBaseComponent } from '../../../components/class-base';

export class WaitScreen extends ClassBaseComponent {
  public view() {
    return template.call(this);
  }
}
