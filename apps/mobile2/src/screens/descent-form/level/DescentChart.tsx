import { useChart } from '@whitewater-guide/clients';
import type { DescentLevelInput } from '@whitewater-guide/schema';

import { Chart } from '../../../components/chart/Chart';
import useOnDataLoaded from './useOnDataLoaded';

interface Props {
  startedAt: Date;
  onLoaded: (value?: DescentLevelInput) => void;
}

function DescentChart({ startedAt, onLoaded }: Props) {
  const {
    gauge,
    measurements: { data },
    unit,
  } = useChart();

  useOnDataLoaded({ data, unit, startedAt, gauge, onLoaded });

  return <Chart />;
}

export default DescentChart;
