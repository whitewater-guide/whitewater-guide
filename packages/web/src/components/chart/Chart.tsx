import { ChartProps, ChartProvider } from '@whitewater-guide/clients';
import React from 'react';

import ChartLayout from './ChartLayout';
import NoData from './NoData';

export const Chart: React.FC<Partial<ChartProps>> = ({ section, gauge }) => {
  if (!gauge) {
    return <NoData />;
  }
  return (
    <ChartProvider section={section} gauge={gauge}>
      <ChartLayout />
    </ChartProvider>
  );
};
