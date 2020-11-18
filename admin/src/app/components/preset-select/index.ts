import { template } from './template';
import { ClassComponent, Vnode } from 'mithril';
import { ISlot } from '../../../../../common/common';
import { PopupManager } from '../../../../../common/popups/PopupManager';
import { EditPresetPopup, IEditPresetType } from '../popups/edit-preset-popup';
import { cloneObject, uuid } from '@gamechangerinteractive/xc-backend/utils';
import { DEFAULT_GAME_DATA } from '../../utils';
import Swal from 'sweetalert2';

interface IPresetSelectAttrs {
  slot: ISlot;
  slots: ISlot[];
  disableEdit: boolean;
  onAddSlot: (slot: ISlot) => Promise<void>;
  onChangeSlot: (slot: ISlot) => void;
  onDeleteSlot: (slot: ISlot) => Promise<void>;
}

export class PresetSelect implements ClassComponent<IPresetSelectAttrs> {
  public slot: ISlot;
  public slots: ISlot[];
  public disableEdit: boolean;
  public onAddSlot: (slot: ISlot) => Promise<void>;
  public onChangeSlot: (slot: ISlot) => void;
  public onDeleteSlot: (slot: ISlot) => Promise<void>;

  public oninit(vnode: Vnode<IPresetSelectAttrs>) {
    this.onbeforeupdate(vnode);
  }

  public onbeforeupdate({ attrs }: Vnode<IPresetSelectAttrs>) {
    this.slot = attrs.slot;
    this.slots = attrs.slots;
    this.disableEdit = attrs.disableEdit;
    this.onAddSlot = attrs.onAddSlot;
    this.onDeleteSlot = attrs.onDeleteSlot;
    this.onChangeSlot = attrs.onChangeSlot;
  }

  public async addPresetHandler() {
    const slot: ISlot = await PopupManager.show(EditPresetPopup, {
      type: IEditPresetType.NEW,
      slot: {
        id: uuid(),
        name: '',
        data: cloneObject(DEFAULT_GAME_DATA),
      },
    });

    if (slot) {
      if (this.onAddSlot) {
        await this.onAddSlot(slot);
      }
    }
  }

  public slotChangeHandler(slotID: string) {
    const slot = this.slots.find((slot) => slot.id === slotID);
    if (this.onChangeSlot) {
      this.onChangeSlot(slot);
    }
  }

  public async deletePresetHandler() {
    const result = await Swal.fire({
      title: `Are you sure that you want to delete ${this.slot.name} slot?`,
      allowEnterKey: false,
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Yes',
    });

    if (result.value) {
      if (this.onDeleteSlot) {
        await this.onDeleteSlot(this.slot);
      }
    }
  }

  public view() {
    return template.call(this);
  }
}
