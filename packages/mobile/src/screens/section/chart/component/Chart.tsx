import { useAppState } from '@react-native-community/hooks';
import { useChart } from '@whitewater-guide/clients';
import React from 'react';
import useUpdateEffect from 'react-use/lib/useUpdateEffect';

import PureChart from './PureChart';

export const Chart: React.FC = () => {
  const {
    gauge,
    section,
    measurements: { loading, data, error, refresh },
    filter,
    unit,
  } = useChart();

  // Refresh chart every time app comes from background
  const appState = useAppState();
  useUpdateEffect(() => {
    if (appState === 'active') {
      refresh();
    }
  }, [appState, refresh]);

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
};

Chart.displayName = 'Chart';
