import type { TimeGridProps } from '@whitewater-guide/clients';
import isEqual from 'date-fns/isEqual';
import React from 'react';
import { Line } from 'victory-native';

export const DescentTimeGrid: React.FC<TimeGridProps> = React.memo(
  ({ days: _, highlightedDate, ...props }) => {
    const style: any = { ...props.style };
    if (highlightedDate && isEqual(highlightedDate, props.datum as any)) {
      style.stroke = '#AAA';
    }
    return <Line {...props} style={style} />;
  },
);

DescentTimeGrid.displayName = 'DescentTimeGrid';
