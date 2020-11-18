import m, { route } from 'mithril';
import { loading } from './app/components/loading';
import { SplashScreen } from './app/screens/splash';

export function initRoutes() {
  const routes = {
    '/splash': SplashScreen,
    '/frontgate': {
      onmatch: async () => (await import('./app/screens/frontgate')).FrontGateScreen,
    },
    '/addition-info': {
      onmatch: async () => (await import('./app/screens/addition-info')).AdditionInfoScreen,
    },
    '/home': createHomeRoute(async () => (await import('./app/screens/main/home/wait')).WaitScreen),
    '/home/countdown': createHomeRoute(async () => (await import('./app/screens/main/home/countdown')).CountDownScreen),
    '/home/question-intro': createHomeRoute(
      async () => (await import('./app/screens/main/home/question-intro')).QuestionIntroScreen,
    ),
    '/home/question-show': createHomeRoute(
      async () => (await import('./app/screens/main/home/question-show')).QuestionShowScreen,
    ),
    '/rank': createMainRoute(async () => (await import('./app/screens/main/rank')).RankScreen),
    '/profile': createMainRoute(async () => (await import('./app/screens/main/profile')).ProfileScreen),
    '/prize': createMainRoute(async () => (await import('./app/screens/main/prizes')).PrizesScreen),
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

function createHomeRoute(fn: () => any) {
  let mainScreen;
  let homeScreen;
  return {
    async onmatch() {
      const [{ MainScreen }, { HomeScreen }, Child] = await loading.wrap(
        Promise.all([import('./app/screens/main'), import('./app/screens/main/home'), fn()]),
      );

      mainScreen = MainScreen;
      homeScreen = HomeScreen;
      return Child;
    },
    render(tag) {
      return m(mainScreen, m(homeScreen, tag));
    },
  };
}
