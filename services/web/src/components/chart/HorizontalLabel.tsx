import { HorizontalLabelProps } from '@whitewater-guide/clients';
import React from 'react';
import { VictoryLabel } from 'victory';

const HorizontalLabel: React.FC<HorizontalLabelProps> = React.memo((props) => {
  const { x, y = 0, textAnchor, datum, style, color } = props;
  return (
    <VictoryLabel
      text={datum}
      textAnchor={textAnchor}
      verticalAnchor="middle"
      x={x}
      y={y}
      style={{ ...style, fill: color }}
    />
  );
});

HorizontalLabel.displayName = 'HorizontalLabel';

export default HorizontalLabel;
