import { ChartProps, ChartProvider } from '@whitewater-guide/clients';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Chart,
  ChartFlowToggle,
  ChartPeriodToggle,
} from '../../../components/chart';
import GaugeInfo from './GaugeInfo';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
  },
});

const ChartLayout: React.SFC<ChartProps> = ({ gauge, section }) => {
  const approximate =
    section &&
    ((section.flows && section.flows.approximate) ||
      (section.levels && section.levels.approximate));
  return (
    <ChartProvider section={section} gauge={gauge}>
      <View style={styles.container}>
        <Chart />
        <ChartPeriodToggle />
        <GaugeInfo gauge={gauge} approximate={!!approximate} />
        <ChartFlowToggle />
      </View>
    </ChartProvider>
  );
};

export default ChartLayout;
