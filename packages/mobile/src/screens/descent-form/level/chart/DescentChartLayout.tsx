import { ChartProvider } from '@whitewater-guide/clients';
import { Section, Unit } from '@whitewater-guide/commons';
import { LevelInput } from '@whitewater-guide/logbook-schema';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import theme from '~/theme';
import subDays from 'date-fns/subDays';
import addDays from 'date-fns/addDays';
import { DescentChart } from './DescentChart';
import DescentChartFlowToggle from './DescentChartFlowToggle';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
  },
  controls: {
    height: 4 * theme.rowHeight,
  },
});

interface Props {
  startedAt: Date;
  section: Section;
  onLoaded: (value?: LevelInput) => void;
}

export const DescentChartLayout: React.FC<Props> = React.memo(
  ({ section, onLoaded, startedAt }) => {
    const initialFilter = {
      from: subDays(startedAt, 1),
      to: addDays(startedAt, 1),
    };

    return (
      <ChartProvider
        section={section}
        gauge={section.gauge!}
        initialFilter={initialFilter}
      >
        <View style={styles.container}>
          <View style={styles.container}>
            <DescentChart startedAt={startedAt} onLoaded={onLoaded} />
          </View>
          <View style={styles.controls}>
            <DescentChartFlowToggle />
          </View>
        </View>
      </ChartProvider>
    );
  },
);
