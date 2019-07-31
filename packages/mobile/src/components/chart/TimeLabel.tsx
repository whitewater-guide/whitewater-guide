import { Period, TimeLabelProps } from '@whitewater-guide/clients';
import isSunday from 'date-fns/isSunday';
import React from 'react';
import { VictoryLabel } from 'victory-native';

const TimeLabel: React.FC<TimeLabelProps> = React.memo(
  ({ period, ...props }) => {
    if (
      props.datum &&
      period === Period.MONTH &&
      isSunday(props.datum as any)
    ) {
      return null; // Only render sundays
    }
    return <VictoryLabel {...props} angle={90} dx={15} dy={-6} />;
  },
);

TimeLabel.displayName = 'TimeLabel';

export default TimeLabel;
