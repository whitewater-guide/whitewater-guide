import { useChart } from '@whitewater-guide/clients';
import React from 'react';
import { useResizeDetector } from 'react-resize-detector';
import { VictoryTheme } from 'victory';

import type { Styles } from '../../styles';
import { Loading } from '../Loading';
import ChartFlowToggle from './ChartFlowToggle';
import ChartPeriodToggle from './ChartPeriodToggle';
import ChartView from './ChartView';
import NoData from './NoData';

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

const ChartLayout: React.FC = () => {
  const {
    measurements: { loading, data },
    unit,
    gauge,
    section,
    filter,
  } = useChart();
  const { ref, width, height } = useResizeDetector<HTMLDivElement>();
  const noData = !data || data.length === 0;

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
              domainPadding={{ x: [0, 50], y: [0, 30] }}
            />
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
