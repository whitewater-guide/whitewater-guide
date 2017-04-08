import { PropTypes } from 'react';
import { Line } from 'victory-native';
import moment from 'moment';

export default class TimeGridLine extends Line {
  static propTypes = {
    ...Line.propTypes,
    period: PropTypes.oneOf(['daily', 'weekly', 'monthly']),
  };

  isAccent = () => {
    const { period, datum } = this.props;
    if (period === 'monthly') {
      return moment(datum).day() === 0; // Only render sundays
    }
    return false;
  };

  // override
  renderAxisLine(props, style, events) {
    const lineStyle = this.isAccent() ? { ...style, stroke: '#AAA' } : style;
    return super.renderAxisLine(props, lineStyle, events);
  }
}

