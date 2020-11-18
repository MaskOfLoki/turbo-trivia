import m from 'mithril';
import { ConfigControl } from '../config-control';
import { isEmptyString } from '@gamechangerinteractive/xc-backend/utils';
import { FileUpload } from '../file-upload';
import Swal from 'sweetalert2';

export class ConfigImageFileUpload extends ConfigControl {
  protected async valueChangeHandler(value: string) {
    if (isEmptyString(value)) {
      const result = await this.confirmDeleteCheck();
      if (result) {
        value = null;
      } else {
        return;
      }
    }

    super.valueChangeHandler(value);
  }

  public async confirmDeleteCheck() {
    const result = await Swal.fire({
      title: `Are you sure that you want to delete this image?`,
      allowEnterKey: false,
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Yes',
    });

    if (result.value) {
      return true;
    } else {
      return false;
    }
  }

  public template(attrs) {
    return m(FileUpload, {
      ...attrs,
      type: 'image',
      value: this.value,
      onchange: this.valueChangeHandler.bind(this),
    });
  }
}
