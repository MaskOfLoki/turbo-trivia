import { template } from './template';

import { IPopupAttrs, PopupComponent } from '../../../../../../common/popups/PopupManager';
import { Vnode } from 'mithril';
import { isEmptyString } from '@gamechangerinteractive/xc-backend/utils';
import { ISlot } from '../../../../../../common/common';
import Swal from 'sweetalert2';

export enum IEditPresetType {
  NEW,
  EDIT,
}

export interface IEditPresetPopupAttrs extends IPopupAttrs {
  type: IEditPresetType;
  slot: ISlot;
}

export class EditPresetPopup extends PopupComponent<IEditPresetPopupAttrs> {
  public slot: ISlot;
  public name = '';

  public view(vnode: Vnode<IEditPresetPopupAttrs>) {
    this.slot = vnode.attrs?.slot;
    return template.call(this, vnode.attrs);
  }

  public saveHandler() {
    if (this.validate()) {
      this.close(this.slot);
    }
  }

  public validate() {
    if (isEmptyString(this.slot.name)) {
      Swal.fire({
        icon: 'warning',
        title: 'Please fill out the slot name.',
      });
      return false;
    }

    return true;
  }
}
