import moment from 'moment';
import React from 'react';
import { Line, LineProps } from 'victory-native';
import { Measurement } from '../../ww-commons';
import { Period } from './types';

interface Props extends LineProps {
  period: Period;
  datum?: number;
  data: Measurement[];
}

const TimeGridLine: React.StatelessComponent<Props> = ({ period, ...props }) => {
  const style = { ...props.style };
  const value = props.data[props.datum].timestamp;
  if (period === Period.MONTH && moment(value).day() === 0) {
    style.stroke = '#AAA';
  }
  return (
    <Line {...props} style={style} />
  );
};

export default TimeGridLine;
