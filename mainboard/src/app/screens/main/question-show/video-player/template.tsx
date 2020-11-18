import m, { redraw } from 'mithril';
import { VideoPlayer } from '.';
import { Player } from '../../../../../../../common/components/player';
import { isEmptyString } from '@gamechangerinteractive/xc-backend/utils';
import { formatTime } from '../../../../../../../common/utils';
import cn from 'classnames';
import { isPreview } from '../../../../../../../common/utils/query';

export function template(this: VideoPlayer) {
  return (
    <div class={this.styles.control}>
      <div class={cn(this.styles.videoWrapper, { [this.styles.isFullWidth]: this.isFullWidth })}>
        {!isEmptyString(this.src) && (
          <Player
            src={this.src}
            class={this.styles.video}
            autoplay={true}
            muted={isPreview()}
            onduration={this.onLoadMedia.bind(this)}
            ref={this.setVideoPlayer.bind(this)}
            ontimeupdate={(duration, currentTime) => {
              if (!this.mediaTimeLine) {
                this.mediaTimeLine = {};
              }
              this.mediaTimeLine.currentTime = currentTime;
              redraw();
            }}
          ></Player>
        )}
        {this.isPaused && (
          <div class={this.styles.playBtnWrapper}>
            <button class={this.styles.playBtn} onclick={this.buttonPlayHandler.bind(this)}></button>
          </div>
        )}
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
