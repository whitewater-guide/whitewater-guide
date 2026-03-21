import type { TimeLabelProps } from '@whitewater-guide/clients';
import isSunday from 'date-fns/isSunday';
import React from 'react';
import { VictoryLabel } from 'victory-native';

export const TimeLabel: React.FC<TimeLabelProps> = React.memo(
  ({ days, highlightedDate: _, ...props }) => {
    if (props.datum && days >= 14 && !isSunday(props.datum as any)) {
      return null;
    }
    return <VictoryLabel {...props} angle={45} dx={15} dy={-6} />;
  },
);

TimeLabel.displayName = 'TimeLabel';
