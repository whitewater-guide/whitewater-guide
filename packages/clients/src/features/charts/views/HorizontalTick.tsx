import type { GaugeBinding } from '@whitewater-guide/schema';
import React from 'react';

import { getColorForValue } from '../../sections';
import type { HorizontalTickProps } from './types';

interface Props {
  x1?: number;
  x2?: number;
  y1?: number;
  y2?: number;
  datum?: number;
  style?: any;
  defaultColor?: string;
  binding?: GaugeBinding | null;
  Component: React.ComponentType<HorizontalTickProps>;
}

const HorizontalTick: React.FC<Props> = React.memo((props) => {
  const {
    x1,
    x2,
    y1,
    y2,
    style,
    datum = 0,
    binding,
    defaultColor: defColor,
    Component,
  } = props;
  const defaultColor = style?.stroke ? style.stroke.toString() : defColor;
  const color = getColorForValue(datum, binding, defaultColor);
  return (
    <Component style={style} color={color} x1={x1} x2={x2} y1={y1} y2={y2} />
  );
});

HorizontalTick.displayName = 'HorizontalTick';

export default HorizontalTick;
