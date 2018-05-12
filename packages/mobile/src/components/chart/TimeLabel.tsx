import moment from 'moment';
import React from 'react';
import { VictoryLabel, VictoryLabelProps } from 'victory-native';
import { Period } from './types';

interface Props extends VictoryLabelProps {
  period: Period;
}

const TimeLabel: React.StatelessComponent<Props> = ({ period, ...props }) => {
  if (period === Period.MONTH && moment(props.datum).day() !== 0) {
    return null; // Only render sundays
  }
  return (
    <VictoryLabel {...props} angle={90} dx={15} dy={-6} />
  );
};

export default TimeLabel;
