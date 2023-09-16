import type { HorizontalGridProps } from '@whitewater-guide/clients';
import React from 'react';
import { LineSegment, VictoryLabel } from 'victory';

const HorizontalGrid = React.memo<HorizontalGridProps>((props) => {
  const { x1 = 0, x2 = 0, y1 = 0, label, style, color } = props;
  return (
    <>
      <LineSegment
        style={{ ...style, stroke: color }}
        x1={x1}
        x2={x2}
        y1={y1}
        y2={y1}
      />
      {label && (
        <VictoryLabel
          text={label}
          textAnchor="start"
          verticalAnchor="middle"
          y={y1}
          x={x2}
          dx={4}
          style={{ fill: color }}
        />
      )}
    </>
  );
});

HorizontalGrid.displayName = 'HorizontalGrid';

export default HorizontalGrid;
