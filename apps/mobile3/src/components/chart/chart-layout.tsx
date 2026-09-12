import { useCallback, useRef, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import { Chart, type ChartHandle } from './chart';
import { ChartFlowToggle } from './chart-flow-toggle';
import { ChartPeriodToggle } from './chart-period-toggle';
import { ChartProvider } from './chart-provider';
import { GaugeInfo } from './gauge-info';
import type { ChartProps } from './types';

import { RowHeight } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const CONTROLS_HEIGHT = 4 * RowHeight;

export interface ChartLayoutProps extends ChartProps {
  collapsed?: boolean;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function ChartLayout({ gauge, section, collapsed }: ChartLayoutProps) {
  const theme = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const chartRef = useRef<ChartHandle>(null);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Promise.all([sleep(500), chartRef.current?.refresh()]).finally(() => {
      setRefreshing(false);
    });
  }, []);

  return (
    <ChartProvider section={section} gauge={gauge}>
      <View style={styles.container} testID="chart-container">
        <ScrollView
          style={styles.chartArea}
          scrollEnabled={false}
          contentContainerStyle={styles.chartContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.primary}
              colors={[theme.primary]}
            />
          }
        >
          <Chart ref={chartRef} />
        </ScrollView>

        <View style={collapsed ? styles.controlsCollapsed : styles.controls}>
          <ChartPeriodToggle />
          <GaugeInfo />
          <ChartFlowToggle />
        </View>
      </View>
    </ChartProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
  },
  chartArea: {
    flex: 1,
  },
  chartContent: {
    flexGrow: 1,
  },
  controls: {
    height: CONTROLS_HEIGHT,
    overflow: 'hidden',
  },
  controlsCollapsed: {
    height: 0,
    overflow: 'hidden',
  },
});
