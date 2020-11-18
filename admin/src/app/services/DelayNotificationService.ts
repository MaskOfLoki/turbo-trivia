import Swal from 'sweetalert2';
import { loading } from '../../../../common/loading';

import { api } from './api';

export class DelayNotificationService {
  public async show(title: string) {
    const usersCount = await api.getOnlineUsers();

    if (usersCount < 10000) {
      return;
    }

    const timer = usersCount * 0.1;
    let timeout: number;

    return loading.wrap(
      Swal.fire({
        title,
        timer,
        timerProgressBar: true,
        allowEnterKey: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        onBeforeOpen(): void {
          Swal.showLoading();
          const content = Swal.getContent();
          const timerHandler = () => {
            const percentage = Math.round((100 * (timer - Swal.getTimerLeft())) / timer);
            content.innerText = `${percentage}%`;
            timeout = setTimeout(timerHandler);
          };

          timerHandler();
        },
        onClose(): void {
          clearTimeout(timeout);
        },
      }),
    );
  }
}

export const delayNotificationService: DelayNotificationService = new DelayNotificationService();
