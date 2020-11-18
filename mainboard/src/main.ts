import './styles.scss';
import { initRoutes } from './main.routes';
import { route } from 'mithril';
import { loading } from '../../common/loading';
import { isPreview } from '../../common/utils/query';

// eslint-disable-next-line
console.info(`%c Turbo Trivia Mainboard, ${BRANCH}, build ${BUILD_NUM}`, 'background: #222; color: #bada55');

async function main() {
  location.hash = '#!/splash';
  initRoutes();
  const [{ api }, { config }] = await loading.wrap(
    Promise.all([import('./app/services/api'), import('./app/services/ConfigService')]),
  );
  await api.init();
  await config.init();

  if (!isPreview()) {
    route.set('/wait');
  }
}

main();
