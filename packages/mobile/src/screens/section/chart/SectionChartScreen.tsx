import { useSection } from '@whitewater-guide/clients';
import React from 'react';
import { NoChart } from '~/components/chart';
import { Screen } from '~/components/Screen';
import ChartLayout from './ChartLayout';
import { SectionChartNavProps } from './types';

const SectionChartScreen: React.FC<SectionChartNavProps> = () => {
  const { node } = useSection();
  const gauge = node && node.gauge;
  return (
    <Screen>
      {node && gauge ? (
        <ChartLayout section={node} gauge={gauge} />
      ) : (
        <NoChart />
      )}
    </Screen>
  );
};

export default SectionChartScreen;
