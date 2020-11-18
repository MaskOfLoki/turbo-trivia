import { isEmptyString } from '@gamechangerinteractive/xc-backend/utils';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { IGameData, IQuestion } from '../../../../common/common';

export function toPromise<T>(observable: Observable<T>): Promise<T> {
  return new Promise((resolve) => observable.pipe(first()).subscribe(resolve));
}

export const DEFAULT_GAME_DATA: IGameData = {
  questions: [],
  titleTimer: 120,
  questionTimer: 200,
  gamePoints: 200,
};

export enum EditType {
  NEW,
  EDIT,
}

export interface IAwardResult {
  success: boolean;
  message?: string;
  winners?: number;
  losers?: number;
}

export interface IPaginatedLeadersRequest {
  channel: string;
  skip: number;
  limit: number;
  filters: Array<any>;
  bannedOnly: boolean;
}

export interface IPaginatedLeadersResponse {
  total: number;
  items;
}

export function isImageBasedQuestion(question: IQuestion) {
  const answer = question?.answers[0];
  return !isEmptyString(answer?.image);
}

export function validURL(str: string): boolean {
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i',
  ); // fragment locator
  return !!pattern.test(str);
}

export interface IProgress {
  current: number;
  total: number;
}

const params: URLSearchParams = new URLSearchParams(location.search);

export function getQueryParam(name: string): string {
  return params.get(name);
}

export function isXeo(): boolean {
  return params.has('xeo');
}

export type ProgressCallback = (progress: IProgress) => void;
