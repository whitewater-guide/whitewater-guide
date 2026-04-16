import type { ChartProps } from '@whitewater-guide/clients';
import { ChartProvider, sleep } from '@whitewater-guide/clients';
import React, { useCallback, useRef, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import theme from '../../theme';
import type { ChartStatic } from './Chart';
import { Chart } from './Chart';
import { ChartFlowToggle } from './ChartFlowToggle';
import { ChartPeriodToggle } from './ChartPeriodToggle';
import { GaugeInfo } from './GaugeInfo';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
  },
  chartArea: {
    flex: 1,
  },
  controls: {
    height: 4 * theme.rowHeight,
    overflow: 'hidden',
  },
  controlsCollapsed: {
    height: 0,
    overflow: 'hidden',
  },
});

interface ChartLayoutProps extends ChartProps {
  collapsed?: boolean;
}

/**
 * Entry point for the chart tab.
 *
 * Wraps everything with ChartProvider (which fires the measurements query),
 * then composes:
 *   - Chart (the actual Skia line chart with auto-refresh)
 *   - A ScrollView (scrollEnabled=false) that wraps Chart for pull-to-refresh
 *   - ChartPeriodToggle / GaugeInfo / ChartFlowToggle controls (collapsible)
 */
function ChartLayout({ gauge, section, collapsed }: ChartLayoutProps) {
  const [refreshing, setRefreshing] = useState(false);
  const chartRef = useRef<ChartStatic>(null);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Promise.all([sleep(500), chartRef.current?.refresh()]).finally(() => {
      setRefreshing(false);
    });
  }, []);

  return (
    <ChartProvider section={section} gauge={gauge}>
      <View style={styles.container} testID="chart-container">
        {/* Chart area with pull-to-refresh */}
        <ScrollView
          style={styles.chartArea}
          scrollEnabled={false}
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.colors.primary}
              colors={[theme.colors.primary]}
            />
          }
        >
          <Chart ref={chartRef} />
        </ScrollView>

        {/* Controls: period, gauge info, unit toggle */}
        <View style={collapsed ? styles.controlsCollapsed : styles.controls}>
          <ChartPeriodToggle />
          <GaugeInfo />
          <ChartFlowToggle />
        </View>
      </View>
    </ChartProvider>
  );
}

export default ChartLayout;
