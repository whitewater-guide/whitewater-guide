import type React from 'react';
import { createContext, useContext } from 'react';

export interface ChartGeometry {
  chartBounds: { left: number; right: number; top: number; bottom: number };
  tsToX: (ts: number) => number;
  valueToY: (v: number) => number;
  boundsLeft: number;
  boundsRight: number;
  boundsTop: number;
  boundsBottom: number;
  width: number;
  height: number;
}

const ChartGeometryContext = createContext<ChartGeometry | null>(null);

export const ChartGeometryProvider = ChartGeometryContext.Provider;

export function useChartGeometry(): ChartGeometry {
  const ctx = useContext(ChartGeometryContext);
  if (!ctx) {
    throw new Error('useChartGeometry must be used inside ChartComponent');
  }
  return ctx;
}

interface SlotProps {
  children?: React.ReactNode;
}

export function ChartSkiaLayer(_props: SlotProps): null {
  return null;
}

export function ChartOverlay(_props: SlotProps): null {
  return null;
}
