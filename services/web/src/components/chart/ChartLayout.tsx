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
};

const ChartLayout: React.FC = () => {
  const {
    measurements: { loading, data },
    unit,
    gauge,
    section,
    days,
  } = useChart();
  if (loading) {
    return <Loading />;
  }
  if (!data || data.length === 0) {
    return <NoData hasGauge={true} />;
  }
  return (
    <div style={styles.root}>
      <div style={styles.chartContainer}>
        <ReactResizeDetector handleHeight={true} handleWidth={true}>
          <ChartView
            data={data}
            days={days}
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
