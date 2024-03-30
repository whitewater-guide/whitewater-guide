import type { Unit } from '@whitewater-guide/schema';

import type { CanvasDimensions, ChartDataPoint } from '../types';

export interface CanvasPoints {
  points: Array<[x: number, y: number]>;
  minVal: number;
  maxVal: number;
  minTs: number;
  maxTs: number;
}

export function dataToCanvas(
  data: ChartDataPoint[],
  unit: Unit,
  canvasParams: CanvasDimensions,
): CanvasPoints {
  // assume that data is sorted by time
  const { width, height, padding } = canvasParams;
  const paddedWidth = width - (padding?.left ?? 0) - (padding?.right ?? 0);
  const paddedHeight = height - (padding?.top ?? 0) - (padding?.bottom ?? 0);

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

  const scaleX = (timestamp: number) =>
    ((timestamp - minTs) / (maxTs - minTs)) * paddedWidth +
    (padding?.left ?? 0);
  const scaleY = (value: number) =>
    height -
    (((value - minVal) / (maxVal - minVal)) * paddedHeight +
      (padding?.bottom ?? 0));

  const points: Array<[number, number]> = data.map((d) => [
    scaleX(d.timestamp.getTime()),
    scaleY(d[unit] ?? 0),
  ]);

  return {
    points,
    minVal,
    maxVal,
    minTs,
    maxTs,
  };
}
