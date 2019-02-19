import { ChartLayoutProps } from '@whitewater-guide/clients';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import GaugeInfo from './GaugeInfo';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
  },
});

const ChartLayout: React.SFC<ChartLayoutProps> = ({
  gauge,
  section,
  chart,
  flowToggle,
  periodToggle,
}) => {
  const approximate =
    section &&
    ((section.flows && section.flows.approximate) ||
      (section.levels && section.levels.approximate));
  return (
    <View style={styles.container}>
      {chart}
      {periodToggle}
      <GaugeInfo gauge={gauge} approximate={!!approximate} />
      {flowToggle}
    </View>
  );
};

export default ChartLayout;
