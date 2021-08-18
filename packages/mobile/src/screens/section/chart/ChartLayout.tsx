import { ChartProps, ChartProvider } from '@whitewater-guide/clients';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import theme from '~/theme';

import { Chart, ChartFlowToggle, ChartPeriodToggle } from './component';
import GaugeInfo from './GaugeInfo';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
  },
  controls: {
    height: 4 * theme.rowHeight,
  },
  controlsCollapsed: {
    height: 0,
  },
});

interface ChartLayoutProps extends ChartProps {
  collapsed?: boolean;
}

const ChartLayout: React.FC<ChartLayoutProps> = ({
  gauge,
  section,
  collapsed,
}) => {
  const approximate =
    section?.flows?.approximate || section?.levels?.approximate;
  const formula = section?.flows?.formula;

  return (
    <ChartProvider section={section} gauge={gauge}>
      <View style={styles.container} testID="chart-container">
        <View style={styles.container}>
          <Chart />
        </View>

        <View style={collapsed ? styles.controlsCollapsed : styles.controls}>
          <ChartPeriodToggle />
          <GaugeInfo
            gauge={gauge}
            approximate={!!approximate}
            formula={formula}
          />
          <ChartFlowToggle />
        </View>
      </View>
    </ChartProvider>
  );
};

export default ChartLayout;
