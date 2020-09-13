import { useChart } from '@whitewater-guide/clients';
import React from 'react';
import ReactResizeDetector from 'react-resize-detector';
import { VictoryScatter, VictoryTheme, VictoryTooltip } from 'victory';

import { Styles } from '../../styles';
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
  if (loading) {
    return <Loading />;
  }
  const noData = !data || data.length === 0;
  return (
    <div style={styles.root}>
      <div style={styles.chartContainer}>
        <ReactResizeDetector handleHeight={true} handleWidth={true}>
          {({ width, height }: any) => (
            <div style={styles.inner}>
              {noData ? (
                <div style={{ width, height }}>
                  <NoData hasGauge={true} />
                </div>
              ) : (
                <ChartView
                  width={width}
                  height={height}
                  data={data}
                  filter={filter}
                  gauge={gauge}
                  unit={unit}
                  section={section}
                  theme={VictoryTheme.material}
                >
                  <VictoryScatter
                    data={data}
                    x="timestamp"
                    y={unit}
                    labelComponent={<VictoryTooltip />}
                  />
                </ChartView>
              )}
            </div>
          )}
        </ReactResizeDetector>
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
