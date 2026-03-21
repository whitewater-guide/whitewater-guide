import type { TimeLabelProps } from '@whitewater-guide/clients';
import isSunday from 'date-fns/isSunday';
import React from 'react';
import { VictoryLabel } from 'victory';

const TimeLabel = React.memo<TimeLabelProps>(
  ({ days, highlightedDate: _, ...props }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (props.datum && days >= 30 && isSunday(props.datum as any)) {
      return null; // Only render sundays
    }
    return <VictoryLabel {...props} angle={45} dx={15} dy={-6} />;
  },
);

TimeLabel.displayName = 'TimeLabel';

export default TimeLabel;
