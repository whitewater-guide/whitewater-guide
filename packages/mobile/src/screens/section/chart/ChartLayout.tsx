import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ChartLayoutProps } from '../../../ww-clients/features/charts';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
  },
});

const ChartLayout: React.StatelessComponent<ChartLayoutProps> = ({ chart, flowToggle, periodToggle }) => (
  <View style={styles.container}>
    {chart}
    {periodToggle}
    {flowToggle}
  </View>
);

export default ChartLayout;
