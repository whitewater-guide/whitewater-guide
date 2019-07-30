import { Period, TimeGridProps } from '@whitewater-guide/clients';
import isSunday from 'date-fns/isSunday';
import React from 'react';
import { LineSegment } from 'victory';

const TimeGrid: React.FC<TimeGridProps> = React.memo(({ period, ...props }) => {
  const style: any = { ...props.style };
  if (props.datum && period === Period.MONTH && isSunday(props.datum)) {
    style.stroke = '#AAA';
  }
  return <LineSegment {...props} {...style} />;
});

TimeGrid.displayName = 'TimeGrid';

export default TimeGrid;
