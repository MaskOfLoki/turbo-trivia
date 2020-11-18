import { IGCLeader, IGCUser } from '@gamechangerinteractive/xc-backend';
import { cloneObject, deepMerge } from '@gamechangerinteractive/xc-backend/utils';
import { ColorValue } from './types/Color';

export const GAME_ID = 'turbo-trivia-2';

export interface IPreset {
  id: string;
  name: string;
  type: string;
  [index: string]: any;
}

export interface IProject extends IPreset {
  id: string;
  slots: ISlot[];
}

export interface IGameData {
  questions: IQuestion[];
  titleTimer: number;
  questionTimer: number;
  gamePoints?: number;
  isRoundBased?: boolean;
}

export interface ISlot {
  id: string;
  name: string;
  data: IGameData;
}

export enum PercentageMode {
  REAL = 'real',
  FAKE = 'fake',
}

export interface IState {
  sid?: string;
  game?: IGameData;
  isFreePlay?: boolean;
  isAutoRun?: boolean;
  startTime?: number;
  questionIndex?: number;
  showResult?: boolean;
  timerTitleStarted?: number;
  showQuestion?: boolean;
  questionStartTime?: number;
  showCorrectAnswer?: boolean;
  showQuestionIntro?: boolean;
  percentage?: number[];
  percentageMode?: PercentageMode;
  leaderboard?: IGCLeader[];
  isAwarded?: boolean;
  revealCountDown?: number;
  intermissionCountDown?: number;
}

export interface IMediaTimeLineInfo {
  duration?: number;
  currentTime?: number;
}

export interface IQuestion {
  id: string;
  text: string;
  file: IFile;
  answers: IAnswer[];
  type?: QuestionType;
}

export enum QuestionType {
  QUESTION_MULTI,
  MEDIA,
}

export interface IFile {
  url: string;
  duration?: number;
}

export interface IAnswer {
  id: string;
  text: string;
  image?: string;
  correct: boolean;
}

export interface IPointsInfo {
  overall: number;
  overallRank: number;
  current: number;
  currentRank: number;
}

export interface IFinalAnswer {
  questionIndex: number;
  answerIndex: number;
  isEliminated: boolean;
}

export interface IHistoryItem {
  points: number;
  position: number;
  title: string;
  date: number;
  isShowDate?: boolean;
}

export interface IUser extends IGCUser {
  optIn?: boolean;
  additional?: {
    [index: string]: any;
  };
  [index: string]: any;
}

export interface IConfig {
  home?: {
    colors?: {
      background: ColorValue;
      button: ColorValue;
      header: ColorValue;
      primary: ColorValue;
      text: ColorValue;
      gamification: ColorValue;
      correct: ColorValue;
      incorrect: ColorValue;
    };
    images?: {
      team?: string;
      sponsor?: string;
    };
    font?: string;
    customFont?: string;
  };
  mobile?: {
    introText?: string;
    welcomeText?: string;
    background?: string;
  };
  game?: {
    gameTitle?: string;
    postGameMessage?: string;
    winningMessage?: string;
    losingMessage?: string;
    defaultUserNamePrefix?: string;
    termsUrl?: string;
    privacyUrl?: string;
  };
  mainboard?: {
    introText?: string;
    welcomeText?: string;
    background?: string;
  };
  desktop?: {
    introText?: string;
    welcomeText?: string;
    background?: string;
  };
  misc?: {
    rawCountdownTimer?: boolean;
    fixedLengthNumbers?: boolean;
  };
  signup?: {
    fields?: ISignupField[];
    anonymous?: boolean;
  };
  feature?: {
    frontGate?: boolean;
    multipleLeaderboards?: boolean;
    automatedPlaythrough?: boolean;
    enabledReportGeneration?: boolean;
    mlbClient?: boolean;
    disabledPrivacy?: boolean;
    disabledTerms?: boolean;
    usernameDialogPopUp?: boolean;
    adminEveryCoupons?: boolean;
    enableAudio?: boolean;
    googleAnalytics?: boolean;
  };
  optin?: {
    enabled?: boolean;
    message?: string;
    defaultChecked?: boolean;
  };
}

export const DEFAULT_CONFIG: IConfig = {
  home: {
    colors: {
      background: '#000235',
      button: '#178DEB',
      header: '#000000',
      primary: '#01ECFC',
      text: '#FFFFFF',
      gamification: '#88139B',
      correct: '#01FCB8',
      incorrect: '#FF4065',
    },
    font: 'Selection1-Bold',
  },
  signup: {
    fields: [],
  },
  game: {
    gameTitle: 'TURBO TRIVIA',
    defaultUserNamePrefix: 'Fan',
    postGameMessage: 'Thanks for playing!',
    winningMessage: 'Congratulations',
    losingMessage: 'Better luck next time!',
  },
  mobile: {
    introText: 'Welcome!',
    welcomeText: 'Welcome to Turbo Trivia!',
  },
  mainboard: {
    introText: 'Welcome!',
    welcomeText: 'Welcome to Turbo Trivia!',
  },
  desktop: {
    introText: 'Welcome!',
    welcomeText: 'Welcome to Turbo Trivia!',
  },
  optin: {
    message: "I'd like to opt in to receive sms messages",
    enabled: false,
  },
};

export interface ISignupField {
  type: SignupFieldType;
  name: string;
}

export enum SignupFieldType {
  STRING,
  MULTIPLE_CHOICE,
}

export interface IMultipleChoiceSignupField extends ISignupField {
  options: string[];
}

export function fillDefaultConfig(value?: IConfig, defaultValue?): IConfig {
  if (!value) {
    value = {};
  }

  const result: IConfig = defaultValue ? cloneObject(defaultValue) : cloneObject(DEFAULT_CONFIG);
  deepMerge(result, value);

  return result;
}

export enum MobilePreviewPage {
  FRONTGATE,
  WAIT,
  INTRO,
  COUNTDOWN,
  SHOW,
  RANK,
}

export enum MainboardPreviewPage {
  WAIT,
  INTRO,
  COUNTDOWN,
  SHOW,
  RANK,
}

export enum MobilePreviewMode {
  MOBILE,
  DESKTOP,
}
