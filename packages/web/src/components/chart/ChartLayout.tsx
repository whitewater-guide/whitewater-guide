import { useChart } from '@whitewater-guide/clients';
import { Unit } from '@whitewater-guide/schema';
import format from 'date-fns/format';
import React, { useCallback } from 'react';
import { useResizeDetector } from 'react-resize-detector';
import {
  createContainer,
  VictoryScatter,
  VictoryTheme,
  VictoryTooltip,
} from 'victory';

import { Styles } from '../../styles';
import { Loading } from '../Loading';
import ChartFlowToggle from './ChartFlowToggle';
import ChartPeriodToggle from './ChartPeriodToggle';
import ChartView from './ChartView';
import NoData from './NoData';

const VictoryZoomVoronoiContainer = createContainer('zoom', 'voronoi');

const styles: Styles = {
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    overflow: 'hidden',
  },
  toggles: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 32,
    marginRight: 32,
  },
  chartContainer: {
    flex: 1,
  },
  inner: {
    height: '100%',
  },
};

interface Datum {
  level: number | null;
  flow: number | null;
  timestamp: Date;
}

const ChartLayout: React.FC = () => {
  const {
    measurements: { loading, data },
    unit,
    gauge,
    section,
    filter,
  } = useChart();
  const { ref, width, height } = useResizeDetector<HTMLDivElement>();
  const { levelUnit, flowUnit } = gauge;
  const noData = !data || data.length === 0;

  const getLabel = useCallback(
    ({ datum }: { datum: Datum }) => {
      const ts = datum.timestamp;
      const val = datum[unit];
      const unitName = unit === Unit.FLOW ? flowUnit : levelUnit;
      return `${val} ${unitName}\n${format(ts, 'Pp')}`;
    },
    [unit, levelUnit, flowUnit],
  );

  return (
    <div style={styles.root}>
      <div ref={ref} style={styles.chartContainer}>
        <div style={styles.inner}>
          {loading && <Loading />}

          {noData && !loading && (
            <div style={{ width, height }}>
              <NoData hasGauge />
            </div>
          )}
          {!noData && !loading && width && height && (
            <ChartView
              width={width}
              height={height}
              data={data}
              filter={filter}
              gauge={gauge}
              unit={unit}
              section={section}
              theme={VictoryTheme.material}
              containerComponent={<VictoryZoomVoronoiContainer />}
            >
              <VictoryScatter
                data={data}
                x="timestamp"
                y={unit}
                labels={getLabel}
                labelComponent={<VictoryTooltip />}
              />
            </ChartView>
          )}
        </div>
      </div>
      <div style={styles.toggles}>
        <ChartFlowToggle />
        <ChartPeriodToggle />
      </div>
    </div>
  );
};

ChartLayout.displayName = 'ChartLayout';

export default ChartLayout;
