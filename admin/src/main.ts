import './styles.scss';
import { initRoutes } from './main.routes';
import { route } from 'mithril';
import { loading } from '../../common/loading';
import { first } from 'rxjs/operators';
import { isEmptyString } from '@gamechangerinteractive/xc-backend/utils';
import { IState } from '../../common/common';

// eslint-disable-next-line
console.info(`%c Turbo Trivia Admin, ${BRANCH}, build ${BUILD_NUM}`, 'background: #222; color: #bada55');

async function main() {
  location.hash = '#!/splash';
  initRoutes();
  const { api } = await loading.wrap(import('./app/services/api'));
  await api.init();
  api
    .state('')
    .pipe(first())
    .subscribe((state: IState) => {
      if (isEmptyString(state?.sid)) {
        route.set('/config');
      } else {
        route.set('/control');
      }
    });
}

main();
