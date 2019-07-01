import { Period, TimeGridProps } from '@whitewater-guide/clients';
import moment from 'moment';
import React from 'react';
import { LineSegment } from 'victory';

const TimeGrid: React.FC<TimeGridProps> = React.memo(({ period, ...props }) => {
  const style: any = { ...props.style };
  if (period === Period.MONTH && moment(props.datum).day() === 0) {
    style.stroke = '#AAA';
  }
  return <LineSegment {...props} {...style} />;
});

TimeGrid.displayName = 'TimeGrid';

export default TimeGrid;
