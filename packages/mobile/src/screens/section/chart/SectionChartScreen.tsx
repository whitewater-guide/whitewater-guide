import { useSection } from '@whitewater-guide/clients';
import React from 'react';

import { NoChart } from '~/components/chart';
import { Screen } from '~/components/Screen';

import ChartLayout from './ChartLayout';
import { SectionChartNavProps } from './types';

const SectionChartScreen: React.FC<SectionChartNavProps> = () => {
  const section = useSection();
  const gauge = section?.gauge;
  return (
    <Screen>
      {section && gauge ? (
        <ChartLayout section={section} gauge={gauge} />
      ) : (
        <NoChart />
      )}
    </Screen>
  );
};

export default SectionChartScreen;
