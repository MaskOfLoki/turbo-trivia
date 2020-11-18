import m from 'mithril';
import cn from 'classnames';
import { PrizesScreen } from './index';
import { config } from '../../../services/ConfigService';

export function template(this: PrizesScreen) {
  const fillColor = config.colors.text;
  return (
    <div class={this.styles.prizes}>
      <div
        class={this.styles.header}
        style={{
          background: config.colors.gamification,
        }}
      >
        <div
          class={this.styles.headerText}
          style={{
            color: config.colors.text,
          }}
        >
          Prizes
        </div>
      </div>
      <div class={this.styles.content}>
        {this.coupons.length === 0 && (
          <div class={this.styles.noWinsMessage}>
            <div class={this.styles.pLossDiv}>
              <p
                class={this.styles.message}
                style={{
                  color: config.colors.text,
                }}
              >
                You haven&apos;t won any prizes yet.
                <br />
                Keep collecting points for a chance to win!
              </p>
              <svg xmlns='http://www.w3.org/2000/svg' width='20vw' height='42vw' viewBox='0 0 70 120'>
                <g transform='translate(-24.462)'>
                  <path
                    d='M136.364,191.4a.976.976,0,0,0-1.283-.992,28.232,28.232,0,0,1-5.744.859,28.232,28.232,0,0,1-5.744-.859.976.976,0,0,0-1.283.992v3.845a1.33,1.33,0,0,0,1.326,1.326h11.4a1.33,1.33,0,0,0,1.326-1.326Z'
                    transform='translate(-71.593 -139.285)'
                    fill='rgba(255,255,255,.2)'
                  />
                  <path
                    d='M113.694,2.652A2.652,2.652,0,0,0,111.042,0h-35a2.652,2.652,0,0,0-2.652,2.652V24.53c0,6.848,2.037,13.081,5.735,17.552a18.387,18.387,0,0,0,28.839,0c3.7-4.47,5.735-10.7,5.735-17.552V2.652Z'
                    transform='translate(-35.796)'
                    fill='rgba(255,255,255,.2)'
                  />
                  <path
                    d='M35.065,38.04c-3.629-1.35-5.3-4.482-5.3-9.689V16.506h4.906V11.2H27.114a2.652,2.652,0,0,0-2.652,2.652v14.5c0,8.844,4.236,14.231,12.025,15.489A32.2,32.2,0,0,1,35.065,38.04Z'
                    transform='translate(0 -8.195)'
                    fill='rgba(255,255,255,.2)'
                  />
                  <path
                    d='M76.037,228.31a2.652,2.652,0,0,0-2.652,2.652v13.127a2.652,2.652,0,0,0,2.652,2.652h35.005a2.652,2.652,0,0,0,2.652-2.652V230.962a2.652,2.652,0,0,0-2.652-2.652Z'
                    transform='translate(-35.796 -167.051)'
                    fill='rgba(255,255,255,.2)'
                  />
                  <path
                    d='M237.093,11.2h-7.558v5.3h4.906V28.351c0,5.207-1.671,8.339-5.3,9.689a32.179,32.179,0,0,1-1.422,5.8c7.789-1.258,12.025-6.646,12.025-15.489v-14.5A2.652,2.652,0,0,0,237.093,11.2Z'
                    transform='translate(-148.72 -8.195)'
                    fill='rgba(255,255,255,.2)'
                  />
                </g>
              </svg>
            </div>
          </div>
        )}
        <div class={this.styles.prizeGrid}>
          {this.coupons.map((coupon) => (
            <div
              class={this.styles.prize}
              style={`background-image: url(${coupon.image})`}
              onclick={this.openPrize.bind(this)}
            />
          ))}
        </div>
      </div>
      <div
        class={cn(this.styles.prizeDialog, { [this.styles.open]: this.dialogOpen })}
        onclick={this.closeDialog.bind(this)}
      >
        <div class={this.styles.overlay} />
        <div class={this.styles.dialogContent} style={{ backgroundImage: this.selectedCouponImage }} />
      </div>
    </div>
  );
}
