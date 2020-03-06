import { ChartProps, ChartProvider } from '@whitewater-guide/clients';
import { Chart, ChartFlowToggle, ChartPeriodToggle } from 'components/chart';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import theme from '../../../theme';
import GaugeInfo from './GaugeInfo';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
  },
  controls: {
    height: 4 * theme.rowHeight,
  },
});

const ChartLayout: React.FC<ChartProps> = ({ gauge, section }) => {
  const approximate =
    section &&
    ((section.flows && section.flows.approximate) ||
      (section.levels && section.levels.approximate));
  const formula = section && section.flows && section.flows.formula;
  return (
    <ChartProvider section={section} gauge={gauge}>
      <View style={styles.container} testID="chart-container">
        <View style={styles.container}>
          <Chart />
        </View>
        <View style={styles.controls}>
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
