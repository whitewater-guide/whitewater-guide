import moment from 'moment';
import React from 'react';
import { Line, LineProps } from 'victory-native';
import { Period } from './types';

interface Props extends LineProps {
  period: Period;
  datum?: any;
}

const TimeGridLine: React.StatelessComponent<Props> = ({ period, ...props }) => {
  const style = { ...props.style };
  if (period === Period.MONTH && moment(props.datum).day() === 0) {
    style.stroke = '#AAA';
  }
  return (
    <Line {...props} style={style} />
  );
};

export default TimeGridLine;
