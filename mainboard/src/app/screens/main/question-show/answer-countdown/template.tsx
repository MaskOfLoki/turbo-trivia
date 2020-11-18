import { AnswerCountDown } from './index';
import m from 'mithril';
import { CircleChart } from '../../../../components/circle-chart';

export function template(this: AnswerCountDown, attrs) {
  return (
    this.isStartCountDown && (
      <CircleChart {...attrs} label={this.timerValue} value={1 - this.percentage * 0.01}></CircleChart>
    )
  );
}
