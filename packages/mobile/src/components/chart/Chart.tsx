import { useChart } from '@whitewater-guide/clients';
import React from 'react';
import PureChart from './PureChart';

export const Chart: React.FC = React.memo(() => {
  const {
    gauge,
    section,
    measurements: { loading, data },
    days,
    unit,
  } = useChart();
  return (
    <PureChart
      loading={loading}
      data={data}
      unit={unit}
      gauge={gauge}
      days={days}
      section={section}
    />
  );
});

Chart.displayName = 'Chart';
