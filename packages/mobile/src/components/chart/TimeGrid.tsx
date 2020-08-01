import { TimeGridProps } from '@whitewater-guide/clients';
import isSunday from 'date-fns/isSunday';
import React from 'react';
import { Line } from 'victory-native';

export const TimeGrid: React.FC<TimeGridProps> = React.memo(
  ({ days, highlightedDate, ...props }) => {
    const style: any = { ...props.style };
    if (props.datum && days >= 30 && isSunday(props.datum)) {
      style.stroke = '#AAA';
    }
    return <Line {...props} style={style} />;
  },
);

TimeGrid.displayName = 'TimeGrid';
