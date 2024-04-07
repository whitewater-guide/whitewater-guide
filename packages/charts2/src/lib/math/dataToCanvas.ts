import type { Unit } from '@whitewater-guide/schema';

import type { CanvasDimensions, ChartDataPoint } from '../types';

export interface Padding {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface ChartData {
  data: ChartDataPoint[];
  scaleX: (timestamp: number) => number;
  scaleY: (value: number) => number;
  points: Array<[x: number, y: number]>;
  minVal: number;
  maxVal: number;
  minTs: number;
  maxTs: number;
  /**
   * Padding of actual chart area inside canvas
   * Axes and ticks and labels are painted outside of this padding, but inside the canvas
   */
  padding: Padding;
}

function getPadding(maxVal: number): Padding {
  return {
    left: 30, // TODO: measure maxVal text
    right: 30,
    top: 30,
    bottom: 30,
  };
}

export function dataToCanvas(
  data: ChartDataPoint[],
  unit: Unit,
  canvasParams: CanvasDimensions,
): ChartData {
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

  const points: Array<[number, number]> = data.map((d) => [
    scaleX(d.timestamp.getTime()),
    scaleY(d[unit] ?? 0),
  ]);

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
  };
}
