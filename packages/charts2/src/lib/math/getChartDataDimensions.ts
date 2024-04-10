import { Skia } from '@shopify/react-native-skia';
import type { Unit } from '@whitewater-guide/schema';

import type { CanvasDimensions, ChartDataPoint } from '../types';
import type { ChartDataDimensions, Padding } from './types';

function getPadding(maxVal: number): Padding {
  return {
    left: 30, // TODO: measure maxVal text
    right: 30,
    top: 30,
    bottom: 30,
  };
}

export function getChartDataDimensions(
  data: ChartDataPoint[],
  unit: Unit,
  canvasParams: CanvasDimensions,
): ChartDataDimensions {
  const { width, height } = canvasParams;

  let minTs = Number.POSITIVE_INFINITY;
  let maxTs = Number.NEGATIVE_INFINITY;
  let minVal = Number.POSITIVE_INFINITY;
  let maxVal = Number.NEGATIVE_INFINITY;

  for (const d of data) {
    const ts = d.timestamp.getTime();
    const v = d[unit];
    if (v !== null && v !== undefined) {
      minVal = Math.min(minVal, v);
      maxVal = Math.max(maxVal, v);
      minTs = Math.min(minTs, ts);
      maxTs = Math.max(maxTs, ts);
    }
  }
  const padding = getPadding(maxVal);

  const paddedWidth = width - (padding.left ?? 0) - (padding.right ?? 0);
  const paddedHeight = height - (padding.top ?? 0) - (padding.bottom ?? 0);

  const scaleX = (timestamp: number) =>
    ((timestamp - minTs) / (maxTs - minTs)) * paddedWidth + (padding.left ?? 0);
  const scaleY = (value: number) =>
    height -
    (((value - minVal) / (maxVal - minVal)) * paddedHeight +
      (padding.bottom ?? 0));

  const points: Array<[number, number]> = [];
  const path = Skia.Path.Make();

  for (let i = 0; i < data.length; i++) {
    const d = data[i];
    const x = scaleX(d.timestamp.getTime());
    const y = scaleY(d[unit] ?? 0);
    points.push([x, y]);

    if (i === 0) {
      path.moveTo(x, y);
    } else {
      path.lineTo(x, y);
    }
  }

  return {
    data,
    scaleX,
    scaleY,
    points,
    minVal,
    maxVal,
    minTs,
    maxTs,
    padding,
    path,
  };
}
