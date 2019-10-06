import { useSection } from '@whitewater-guide/clients';
import { NoChart } from 'components/chart';
import { Screen } from 'components/Screen';
import React from 'react';
import { NavigationScreenComponent } from 'react-navigation';
import ChartLayout from './ChartLayout';

const SectionChartScreen: NavigationScreenComponent = () => {
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
