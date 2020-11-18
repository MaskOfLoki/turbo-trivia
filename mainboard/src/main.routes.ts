import m, { route } from 'mithril';
import { loading } from '../../common/loading';
import { SplashScreen } from './app/screens/splash';

export function initRoutes() {
  const routes = {
    '/splash': SplashScreen,
    '/wait': createMainRoute(async () => (await import('./app/screens/main/wait')).WaitScreen),
    '/countdown': createMainRoute(async () => (await import('./app/screens/main/countdown')).CountDownScreen),
    '/question-intro': createMainRoute(
      async () => (await import('./app/screens/main/question-intro')).QuestionIntroScreen,
    ),
    '/question-show': createMainRoute(
      async () => (await import('./app/screens/main/question-show')).QuestionShowScreen,
    ),
    '/end': createMainRoute(async () => (await import('./app/screens/main/ending')).EndingScreen),
  };

  route(document.querySelector('.app-root'), '/splash', routes);
}

function createMainRoute(fn: () => any) {
  let mainScreen;
  return {
    async onmatch() {
      const [{ MainScreen }, Child] = await loading.wrap(Promise.all([import('./app/screens/main'), fn()]));
      mainScreen = MainScreen;
      return Child;
    },
    render(tag) {
      return m(mainScreen, tag);
    },
  };
}
