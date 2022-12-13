import { ChartProps, ChartProvider, sleep } from '@whitewater-guide/clients';
import React, { useCallback, useRef, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import theme from '~/theme';

import {
  Chart,
  ChartFlowToggle,
  ChartPeriodToggle,
  ChartStatic,
} from './component';
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
  refreshScroll: {
    flex: 1,
  },
  fakeContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: 'transparent',
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
  // Pull overlay to refresh chart
  const [refreshing, setRefreshing] = useState(false);
  const chartRef = useRef<ChartStatic>(null);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Promise.all([sleep(500), chartRef.current?.refresh()]).finally(() => {
      setRefreshing(false);
    });
  }, [chartRef, setRefreshing]);

  return (
    <ChartProvider section={section} gauge={gauge}>
      <View style={styles.container} testID="chart-container">
        <View style={styles.container}>
          <Chart ref={chartRef} />

          <View style={styles.fakeContent}>
            <ScrollView
              style={styles.refreshScroll}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor={theme.colors.primary}
                  colors={[theme.colors.primary]}
                />
              }
            />
          </View>
        </View>

        <View style={collapsed ? styles.controlsCollapsed : styles.controls}>
          <ChartPeriodToggle />
          <GaugeInfo />
          <ChartFlowToggle />
        </View>
      </View>
    </ChartProvider>
  );
};

export default ChartLayout;
