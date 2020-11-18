import m, { redraw } from 'mithril';
import { AudioPlayer } from '.';
import { Player } from '../../../../../../../../common/components/player';
import { isEmptyString } from '@gamechangerinteractive/xc-backend/utils';
import { formatTime } from '../../../../../../../../common/utils';
import cn from 'classnames';
import { isPreview } from '../../../../../../../../common/utils/query';

export function template(this: AudioPlayer) {
  return (
    <div class={this.styles.control}>
      <div class={cn(this.styles.audioWrapper, { [this.styles.isPlaying]: !this.isPaused })}>
        {!isEmptyString(this.src) && (
          <Player
            src={this.src}
            class={this.styles.audio}
            autoplay={true}
            muted={isPreview()}
            onduration={this.onLoadMedia.bind(this)}
            ref={this.setAudioPlayer.bind(this)}
            ontimeupdate={(duration, currentTime) => {
              if (!this.mediaTimeLine) {
                this.mediaTimeLine = {};
              }
              this.mediaTimeLine.currentTime = currentTime;
              redraw();
            }}
          ></Player>
        )}
        <div class={this.styles.playBtnWrapper}>
          <button class={this.styles.playBtn} onclick={this.buttonPlayHandler.bind(this)}></button>
        </div>
      </div>
      <div class={this.styles.controlBar}>
        {this.mediaTimeLine && (
          <div class={this.styles.progressBar}>
            <div class={this.styles.progressValue} style={{ width: `${this.progressPercent}%` }}></div>
          </div>
        )}
        {this.mediaTimeLine && (
          <div class={this.styles.mediaDuration}>
            {formatTime(this.mediaTimeLine.currentTime)} / {formatTime(this.mediaTimeLine.duration)}
          </div>
        )}
        {this.mediaTimeLine && (
          <button
            class={cn(this.styles.muteBtn, { [this.styles.isUnmuted]: !this.isMuted })}
            onclick={this.muteHandler.bind(this)}
          ></button>
        )}
      </div>
    </div>
  );
}
