import { useChart } from '@whitewater-guide/clients';
import React from 'react';

import PureChart from './PureChart';

export const Chart: React.FC = () => {
  const {
    gauge,
    section,
    measurements: { loading, data },
    filter,
    unit,
  } = useChart();
  return (
    <PureChart
      loading={loading}
      data={data}
      unit={unit}
      gauge={gauge}
      filter={filter}
      section={section}
    />
  );
};

Chart.displayName = 'Chart';
