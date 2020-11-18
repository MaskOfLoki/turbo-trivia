import { initRoutes } from './main.routes';

import { isEmptyString, isIOS } from '@gamechangerinteractive/xc-backend/utils';

import './styles.scss';
import { route } from 'mithril';
import { orientation } from './app/services/OrientationService';
import { loading } from './app/components/loading';
import { combineLatest } from 'rxjs';
import { isPreview } from '../../common/utils/query';
import { filter, first, startWith } from 'rxjs/operators';
import { IUser } from '../../common/common';
import { isXeo } from './app/utils';

// eslint-disable-next-line
console.info(`%c Turbo Trivia Mobile, ${BRANCH}, build ${BUILD_NUM}`, 'background: #222; color: #bada55');

async function main() {
  setTimeout(fixIOSZoom, 100);
  location.href = '#/splash';
  initRoutes();

  const [{ api }, { config }] = await loading.wrap(
    Promise.all([import('./app/services/api'), import('./app/services/ConfigService')]),
  );

  orientation.start();
  await api.init();
  await config.init();
  const user = await api.isLoggedIn();

  if (!isPreview()) {
    if (!user) {
      if (config?.signup?.anonymous) {
        await api.loginAnonymously();
      }
      route.set('/frontgate');
    }

    combineLatest([api.user.pipe(startWith(null as IUser)), api.config])
      .pipe(
        filter(([user, config]) => {
          if (!user && route.get() === '/frontgate' && config?.signup?.anonymous) {
            api.loginAnonymously();
            return false;
          }

          if (!user) {
            return false;
          }

          if (!isXeo() && isEmptyString(user.username)) {
            route.set('/frontgate');
            return false;
          }

          if (
            !isXeo() &&
            !config?.signup?.anonymous &&
            config?.signup?.fields.some((field) => isEmptyString(user[field.name]))
          ) {
            route.set('/addition-info');
            return false;
          }

          return true;
        }),
        first(),
      )
      .subscribe(() => {
        route.set('/home');
      });
  }
}

function fixIOSZoom() {
  if (!isIOS()) {
    return;
  }

  document.addEventListener(
    'touchstart',
    (event) => {
      if (event.touches.length > 1) {
        event.preventDefault();
      }
    },
    { passive: false },
  );
}

main();
