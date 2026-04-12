import { useNetInfo } from '@react-native-community/netinfo';
import { useChart } from '@whitewater-guide/clients';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import type { LayoutChangeEvent, LayoutRectangle } from 'react-native';
import { StyleSheet, View } from 'react-native';

import { useAppState } from '../../hooks/useAppState';
import Loading from '../Loading';
import ChartComponent from './ChartComponent';
import NoChart from './NoChart';

export interface ChartStatic {
  refresh: () => Promise<void>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

/**
 * Stateful wrapper around ChartComponent.
 *
 * - Reads all chart data from the nearest ChartProvider via useChart()
 * - Measures its own layout to pass explicit width/height to ChartComponent
 * - Auto-refreshes measurements when the app returns from background
 * - Exposes a `refresh()` imperative handle for pull-to-refresh integration
 */
export const Chart = forwardRef<ChartStatic>((_props, ref) => {
  const {
    gauge,
    section,
    measurements: { loading, data, error, refresh },
    filter,
    unit,
  } = useChart();

  const refreshRef = useRef(refresh);
  refreshRef.current = refresh;

  // Auto-refresh when the app comes back from background
  const appState = useAppState();
  const prevAppState = useRef(appState);
  useEffect(() => {
    if (prevAppState.current !== 'active' && appState === 'active') {
      refreshRef.current();
    }
    prevAppState.current = appState;
  }, [appState]);

  useImperativeHandle(ref, () => ({
    refresh: () => refreshRef.current(),
  }));

  const [layout, setLayout] = useState<LayoutRectangle | null>(null);
  const onLayout = useCallback((e: LayoutChangeEvent) => {
    setLayout(e.nativeEvent.layout);
  }, []);

  const { isInternetReachable } = useNetInfo();

  if (loading) {
    return <Loading />;
  }

  if (isInternetReachable === false && !!error) {
    return <NoChart reason="offline" />;
  }

  if (!data || data.length === 0) {
    return <NoChart reason="noData" />;
  }

  return (
    <View style={styles.container} onLayout={onLayout}>
      {!!layout && layout.width > 0 && layout.height > 0 && (
        <ChartComponent
          data={data}
          unit={unit}
          gauge={gauge}
          section={section}
          filter={filter}
          width={layout.width}
          height={layout.height}
        />
      )}
    </View>
  );
});

Chart.displayName = 'Chart';
