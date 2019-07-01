import { Period, TimeLabelProps } from '@whitewater-guide/clients';
import moment from 'moment';
import React from 'react';
import { VictoryLabel } from 'victory';

const TimeLabel: React.FC<TimeLabelProps> = React.memo(
  ({ period, ...props }) => {
    if (period === Period.MONTH && moment(props.datum).day() !== 0) {
      return null; // Only render sundays
    }
    return <VictoryLabel {...props} angle={90} dx={15} dy={-6} />;
  },
);

TimeLabel.displayName = 'TimeLabel';

export default TimeLabel;
