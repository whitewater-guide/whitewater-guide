import { ChartProvider } from '@whitewater-guide/clients';
import type { DescentLevelInput, DescentSectionFragment } from '@whitewater-guide/schema';
import addDays from 'date-fns/addDays';
import subDays from 'date-fns/subDays';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import DescentChart from './DescentChart';
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

function DescentChartLayout({ section, startedAt, onLoaded }: Props) {
  const startedAtDate = useMemo(() => new Date(startedAt), [startedAt]);
  const initialFilter = useMemo(
    () => ({
      from: subDays(startedAtDate, 1).toISOString(),
      to: addDays(startedAtDate, 1).toISOString(),
    }),
    [startedAtDate],
  );

  if (!section.gauge) {
    return null;
  }

  return (
    <ChartProvider
      section={section}
      gauge={section.gauge}
      initialFilter={initialFilter}
    >
      <View style={styles.container}>
        <View style={styles.chart}>
          <DescentChart startedAt={startedAtDate} onLoaded={onLoaded} />
        </View>
        <DescentChartFlowToggle />
      </View>
    </ChartProvider>
  );
}

export default DescentChartLayout;
