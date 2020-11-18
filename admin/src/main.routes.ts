import { route } from 'mithril';
import { SplashScreen } from './app/screens/splash';
import { loading } from '../../common/loading';

export function initRoutes() {
  const routes = {
    '/splash': SplashScreen,
    '/config': {
      onmatch: async () => (await loading.wrap(import('./app/screens/config'))).ConfigScreen,
    },
    '/control': {
      onmatch: async () => (await loading.wrap(import('./app/screens/control'))).ControlScreen,
    },
  };

  route(document.querySelector('.app-root'), '/splash', routes);
}
