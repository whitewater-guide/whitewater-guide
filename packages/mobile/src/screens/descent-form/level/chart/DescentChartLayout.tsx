/* eslint-disable import/no-duplicates */
import { ChartProvider } from '@whitewater-guide/clients';
import {
  DescentLevelInput,
  DescentSectionFragment,
} from '@whitewater-guide/schema';
import addDays from 'date-fns/addDays';
import subDays from 'date-fns/subDays';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { DescentChart } from './DescentChart';
import DescentChartFlowToggle from './DescentChartFlowToggle';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
  },
  chart: {
    flex: 1,
    alignSelf: 'stretch',
  },
});

interface Props {
  startedAt: string;
  section: DescentSectionFragment;
  onLoaded: (value?: DescentLevelInput) => void;
}

export const DescentChartLayout = React.memo(
  ({ section, onLoaded, startedAt }: Props) => {
    if (!section.gauge) {
      return null;
    }

    const initialFilter = {
      from: subDays(new Date(startedAt), 1).toISOString(),
      to: addDays(new Date(startedAt), 1).toISOString(),
    };

    return (
      <ChartProvider
        section={section}
        gauge={section.gauge}
        initialFilter={initialFilter}
      >
        <View style={styles.container}>
          <View style={styles.chart}>
            <DescentChart startedAt={new Date(startedAt)} onLoaded={onLoaded} />
          </View>
          <DescentChartFlowToggle />
        </View>
      </ChartProvider>
    );
  },
);

DescentChartLayout.displayName = 'DescentChartLayout';
