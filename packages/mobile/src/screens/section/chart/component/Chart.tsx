import { useAppState } from '@react-native-community/hooks';
import { useChart } from '@whitewater-guide/clients';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import useUpdateEffect from 'react-use/lib/useUpdateEffect';

import PureChart from './PureChart';

export interface ChartStatic {
  refresh: () => Promise<void>;
}

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

  // Refresh chart every time app comes from background
  const appState = useAppState();
  useUpdateEffect(() => {
    if (appState === 'active') {
      refreshRef.current();
    }
  }, [appState, refreshRef]);

  useImperativeHandle(ref, () => ({
    refresh,
  }));

  return (
    <PureChart
      loading={loading}
      data={data}
      unit={unit}
      gauge={gauge}
      filter={filter}
      section={section}
      error={error}
    />
  );
});

Chart.displayName = 'Chart';
