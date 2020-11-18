import { config } from '../../../services/ConfigService';
import m from 'mithril';
import { Header } from '.';
import PointsDisplay from './points-display';
import hmbAnimData from '../../../../assets/animation/HBM_Transition.json';
import XCAnimateAE, { IXCAnimateConfig } from '../../../components/animate-ae';
import cn from 'classnames';

export function template(this: Header) {
  const route = m.route.get();
  const hmbconfig: IXCAnimateConfig = {
    animation: {
      data: hmbAnimData,
      initialSegment: [0, 30],
    },
    id: this.styles.menuButton,
    width: 75,
    height: 62.5,
    onclick: this.menuClickHandler.bind(this),
    onclickPlay: true,
    pingpong: true,
  };

  return (
    <div
      class={this.styles.control}
      style={{
        background: `${config.home?.colors?.header}`,
      }}
    >
      <PointsDisplay points={this.pointsCurrent} rank={this.rankCurrent} />
      <XCAnimateAE config={hmbconfig} />
      {this.isSideNavVisible && (
        <div id={this.styles.slideNav}>
          <div class={this.styles.overlay}></div>
          <div
            class={this.styles.gleam}
            style={{
              background: `${config.home?.colors?.primary}`,
              boxShadow: `-1px 0px 10px 3px ${config.home?.colors?.primary}`,
            }}
          ></div>
          {!this.isTermConditionView && (
            <a
              class={cn(this.styles.sliderItem, { [`${this.styles.selected}`]: route.includes('profile') })}
              onclick={() => this.onRouterClick('profile')}
            >
              <div class={this.styles.userIcon} />
              <div class={this.styles.userInfo}>
                <span>{this.userName}</span>
                <span>RANK: {this.rank}</span>
              </div>
            </a>
          )}
          {!this.isTermConditionView && (
            <a
              class={cn(this.styles.sliderItem, { [`${this.styles.selected}`]: route.includes('home') })}
              onclick={() => this.onRouterClick('home')}
            >
              <div class={this.styles.homeIcon} />
              <span>Home</span>
            </a>
          )}
          {!this.isTermConditionView && (
            <a
              class={cn(this.styles.sliderItem, { [`${this.styles.selected}`]: route.includes('rank') })}
              onclick={() => this.onRouterClick('rank')}
            >
              <div class={this.styles.rankIcon} />
              <span>Rank</span>
            </a>
          )}
          {!this.isTermConditionView && (
            <a
              class={cn(this.styles.sliderItem, { [`${this.styles.selected}`]: route.includes('prize') })}
              onclick={() => this.onRouterClick('prize')}
            >
              <div class={this.styles.prizeIcon} />
              <span>Prizes</span>
            </a>
          )}
          {!this.isTermConditionView && (config.game?.privacyUrl || config.game?.termsUrl) && (
            <a class={`${this.styles.sliderItem}`} onclick={() => this.termConditionHandler()}>
              <div class={this.styles.termsIcon} />
              <span>Terms &amp; Conditions</span>
            </a>
          )}
          {this.isTermConditionView && (
            <a class={`${this.styles.sliderItem}`} onclick={() => this.termConditionHandler()}>
              <div class={this.styles.backIcon} />
              <span class={this.styles.backText} style={{ color: config.home?.colors?.primary }}>
                Back
              </span>
            </a>
          )}
          {this.isTermConditionView && config.game?.privacyUrl && (
            <a class={`${this.styles.sliderItem}`} href={config.game?.privacyUrl}>
              <div class={this.styles.icon} />
              <span>Privacy Policy</span>
            </a>
          )}
          {this.isTermConditionView && config.game?.termsUrl && (
            <a class={`${this.styles.sliderItem}`} href={config.game?.termsUrl}>
              <div class={this.styles.icon} />
              <span>Term Policy</span>
            </a>
          )}
        </div>
      )}
    </div>
  );
}
