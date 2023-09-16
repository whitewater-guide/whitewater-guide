import type { GaugeBinding } from '@whitewater-guide/schema';
import React from 'react';

import { getColorForValue } from '../../sections';
import type { HorizontalGridProps } from './types';

interface Props {
  x1?: number;
  x2?: number;
  y1?: number;
  y2?: number;
  datum?: number;
  style?: any;
  binding?: GaugeBinding | null;
  defaultColor?: string;
  Component: React.ComponentType<HorizontalGridProps>;
}

const HorizontalGrid: React.FC<Props> = React.memo((props) => {
  const {
    x1 = 0,
    x2 = 0,
    y1 = 0,
    y2 = 0,
    datum = 0,
    binding,
    style,
    defaultColor: defColor,
    Component,
  } = props;
  const { minimum = 0, maximum = 0, optimum = 0 } = binding || {};
  const defaultColor = style?.stroke ? style.stroke.toString() : defColor;
  const color = getColorForValue(datum, binding, defaultColor);
  let label;
  if (datum === minimum) {
    label = 'min';
  } else if (datum === optimum) {
    label = 'opt';
  } else if (datum === maximum) {
    label = 'max';
  }
  return (
    <Component
      x1={x1}
      x2={x2}
      y1={y1}
      y2={y2}
      label={label}
      style={style}
      color={color}
    />
  );
});

HorizontalGrid.displayName = 'HorizontalGrid';

export default HorizontalGrid;
