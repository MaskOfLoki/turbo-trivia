export interface IPlayer {
  play(): void;
  pause(): void;
  muted: boolean;
  autoplay: boolean;
  seek(milliseconds: number): void;
  readonly paused: boolean;
  readonly duration: number;
  readonly position: number;
  destroy(): void;
}

export interface IPlayerAttrs {
  ref?: (value: IPlayer) => void;
  src?: string;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
}
