import { ChartProvider } from '@whitewater-guide/clients';
import { DescentLevelInput, Section } from '@whitewater-guide/commons';
import addDays from 'date-fns/addDays';
import subDays from 'date-fns/subDays';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import theme from '~/theme';
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
  startedAt: string;
  section: Section;
  onLoaded: (value?: DescentLevelInput) => void;
}

export const DescentChartLayout: React.FC<Props> = React.memo(
  ({ section, onLoaded, startedAt }) => {
    const initialFilter = {
      from: subDays(new Date(startedAt), 1),
      to: addDays(new Date(startedAt), 1),
    };

    return (
      <ChartProvider
        section={section}
        gauge={section.gauge!}
        initialFilter={initialFilter}
      >
        <View style={styles.container}>
          <View style={styles.container}>
            <DescentChart startedAt={new Date(startedAt)} onLoaded={onLoaded} />
          </View>
          <View style={styles.controls}>
            <DescentChartFlowToggle />
          </View>
        </View>
      </ChartProvider>
    );
  },
);
