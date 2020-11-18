import m from 'mithril';
import PointsDisplay from '.';
import sparksData from '../../../../../assets/animation/Spark-Point_Corner.json';
import lineData from '../../../../../assets/animation/Purple-Line_Base.json';
import glowLineData from '../../../../../assets/animation/Purple-Line_Glow.json';
import { XCCountUp } from '../../../../components/count-up';
import XCAnimateAE, { IXCAnimateConfig } from '../../../../components/animate-ae';
import { config } from '../../../../services/ConfigService';

export function template(this: PointsDisplay) {
  const sparksConfig: IXCAnimateConfig = {
    animation: {
      data: sparksData,
      autoplay: false,
      loop: false,
    },
    id: this.styles.sparks,
    play: this.startSparks,
    eventListeners: [{ eventName: 'complete', callback: this.resetAnimation.bind(this) }],
  };

  const lineConfig: IXCAnimateConfig = {
    animation: {
      data: lineData,
      autoplay: false,
      loop: false,
    },
    id: this.styles.line,
    play: this.startLine,
    eventListeners: [{ eventName: 'complete', callback: this.startPhase2.bind(this) }],
  };

  const glowLineConfig: IXCAnimateConfig = {
    animation: {
      data: glowLineData,
      autoplay: false,
      loop: false,
    },
    play: this.startGlowLine,
    id: this.styles.glowLine,
    eventListeners: [{ eventName: 'complete', callback: this.playSparks.bind(this) }],
  };

  return (
    <div class={this.styles.pointCol}>
      <div
        id={this.styles.rank}
        style={{
          color: config.colors.text,
        }}
      >
        {this.rank}
      </div>
      <XCAnimateAE config={lineConfig}></XCAnimateAE>
      <XCAnimateAE config={glowLineConfig}></XCAnimateAE>
      <div
        id={this.styles.points}
        style={{
          color: config.colors.text,
        }}
      >
        <XCCountUp
          startValue={this.beginPoints}
          endValue={this.endPoints}
          start={this.startCountUp}
          onComplete={{ function: this.noOp.bind(this) }}
        ></XCCountUp>
      </div>
      <XCAnimateAE config={sparksConfig}></XCAnimateAE>
    </div>
  );
}
