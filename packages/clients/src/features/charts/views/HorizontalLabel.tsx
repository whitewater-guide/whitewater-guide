import { GaugeBinding } from '@whitewater-guide/schema';
import React from 'react';
import { TextAnchorType } from 'victory-core';

import { getColorForValue } from '../../sections';
import { HorizontalLabelProps } from './types';

interface Props {
  x?: number;
  y?: number;
  textAnchor?: TextAnchorType;
  datum?: number;
  style?: any;
  binding?: GaugeBinding | null;
  defaultColor?: string;
  Component: React.ComponentType<HorizontalLabelProps>;
}

const HorizontalLabel: React.FC<Props> = React.memo((props) => {
  const {
    x,
    y = 0,
    textAnchor,
    binding,
    datum = 0,
    style,
    defaultColor: defColor,
    Component,
  } = props;
  const defaultColor = style?.fill ? style.fill.toString() : defColor;
  const color = getColorForValue(datum, binding, defaultColor);
  return (
    <Component
      x={x}
      y={y}
      textAnchor={textAnchor}
      datum={datum}
      style={style}
      color={color}
    />
  );
});

HorizontalLabel.displayName = 'HorizontalLabel';

export default HorizontalLabel;
