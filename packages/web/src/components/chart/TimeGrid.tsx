import { TimeGridProps } from '@whitewater-guide/clients';
import isSunday from 'date-fns/isSunday';
import React from 'react';
import { LineSegment } from 'victory';

const TimeGrid: React.FC<TimeGridProps> = React.memo(
  ({ days, highlightedDate: _, ...props }) => {
    const style: any = { ...props.style };
    if (props.datum && days >= 30 && isSunday(props.datum)) {
      style.stroke = '#AAA';
    }
    return <LineSegment {...props} {...style} />;
  },
);

TimeGrid.displayName = 'TimeGrid';

export default TimeGrid;