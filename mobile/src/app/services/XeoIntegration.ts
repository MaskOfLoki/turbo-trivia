import { IGCLeader } from '@gamechangerinteractive/xc-backend';
import { randInt } from '@gamechangerinteractive/xc-backend/utils';

export enum IncomingEvents {
  READY = 'ready',
  GET_LEADERBOARD = 'get_leaderboard',
  AWARD_POINTS = 'award_points',
  AWARD_USER = 'award_user',
  GET_LEADER_ENTRY = 'get_leader_entry',
  INIT_LEADER_ENTRY = 'init_leader_entry',
}

export interface IRequest {
  id: number;
  event: IncomingEvents;
  data?: any;
}

export enum OutgoingEvents {
  STATE = 'state',
  CONFIG = 'config',
  USER = 'user',
  GAME_DATA = 'game_data',
  RESPONSE = 'response',
}

export interface IMessage {
  id?: number;
  event: OutgoingEvents;
  data?: any;
}

export class XeoIntegration {
  private _responses = {};

  constructor() {
    if (window.parent && window.parent !== window) {
      this.sendRequest({ id: randInt(1000, 10000), event: IncomingEvents.READY });
      window.addEventListener('message', this.parseMessage.bind(this));
    }
  }

  private parseMessage(event: MessageEvent) {
    const message = event.data as IMessage;
    if (message?.event === OutgoingEvents.RESPONSE) {
      if (this._responses[message.id]) {
        this._responses[message.id].res(message.data);
        delete this._responses[message.id];
      }
    }
  }

  public async sendLeaderBoardRequest(leaderboard: string, limit: number): Promise<any> {
    const messageId = randInt(1000, 10000);
    this.sendRequest({ id: messageId, event: IncomingEvents.GET_LEADERBOARD, data: { leaderboard, limit } });

    return new Promise((res, rej) => {
      this._responses[messageId] = {
        res,
        rej,
      };
    });
  }

  public async sendLeaderEntry(leaderboard: string): Promise<any> {
    const messageId = randInt(1000, 10000);
    this.sendRequest({ id: messageId, event: IncomingEvents.GET_LEADER_ENTRY, data: { leaderboard } });

    return new Promise((res, rej) => {
      this._responses[messageId] = {
        res,
        rej,
      };
    });
  }

  public async sendInitLeaderEntry(leaderboard: string): Promise<any> {
    const messageId = randInt(1000, 10000);
    this.sendRequest({ id: messageId, event: IncomingEvents.INIT_LEADER_ENTRY, data: { leaderboard } });

    return new Promise((res, rej) => {
      this._responses[messageId] = {
        res,
        rej,
      };
    });
  }

  public async send(leaderboard: string): Promise<any> {
    const messageId = randInt(1000, 10000);
    this.sendRequest({ id: messageId, event: IncomingEvents.GET_LEADER_ENTRY, data: { leaderboard } });

    return new Promise((res, rej) => {
      this._responses[messageId] = {
        res,
        rej,
      };
    });
  }

  public async sendXeoAwardUserRequest(): Promise<any> {
    const messageId = randInt(1000, 10000);
    this.sendRequest({
      id: messageId,
      event: IncomingEvents.AWARD_USER,
    });

    return new Promise((res, rej) => {
      this._responses[messageId] = {
        res,
        rej,
      };
    });
  }

  public sendAddPoints(points: number, leaderboards: string[]): Promise<any> {
    const messageId = randInt(1000, 10000);
    this.sendRequest({
      id: messageId,
      event: IncomingEvents.AWARD_POINTS,
      data: { amount: points, leaderboards: leaderboards },
    });

    return new Promise((res, rej) => {
      this._responses[messageId] = {
        res,
        rej,
      };
    });
  }

  protected sendRequest(request: IRequest) {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage(request, '*');
    }
  }
}
