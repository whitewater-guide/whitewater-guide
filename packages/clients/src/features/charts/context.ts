import React from 'react';
import { ChartContext, WithMeasurements } from './types';

export const PureChartContext = React.createContext<
  ChartContext & WithMeasurements
>({} as any);
