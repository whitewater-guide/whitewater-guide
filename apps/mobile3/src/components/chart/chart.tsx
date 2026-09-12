import { useNetworkState } from 'expo-network';
import {
  type Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import type { LayoutChangeEvent, LayoutRectangle } from 'react-native';
import { StyleSheet, View } from 'react-native';

import { ChartComponent } from './chart-component';
import { NoChart } from './no-chart';
import { useChart } from './chart-provider';

import { Loading } from '@/components/loading';
import { useAppState } from '@/hooks/use-app-state';

export interface ChartHandle {
  refresh: () => Promise<void>;
}

export interface ChartInstanceProps {
  ref?: Ref<ChartHandle>;
}

export function Chart({ ref }: ChartInstanceProps) {
  const {
    gauge,
    section,
    measurements: { loading, data, error, refresh },
    filter,
    unit,
  } = useChart();

  const refreshRef = useRef(refresh);
  refreshRef.current = refresh;

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

  const { isInternetReachable } = useNetworkState();

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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
