import type { SkPath } from '@shopify/react-native-skia';

import type { ChartDataPoint } from '../types';

export interface XTick {
  timestamp: number;
  x: number;
  label: string;
}

export interface XTicks {
  minZoom: number;
  maxZoom: number;
  ticks: XTick[];
  gridLines: SkPath;
}

export interface Padding {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface ChartDataDimensions {
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
  /**
   * Main chart line
   */
  path: SkPath;
}

export interface ChartData extends ChartDataDimensions {
  /**
   * X-Values, zoom levels and labels to render ticks and grid lines
   */
  xTicks: XTicks[];
}
