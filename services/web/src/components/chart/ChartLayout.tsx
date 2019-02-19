import { ChartLayoutProps } from '@whitewater-guide/clients';
import React from 'react';
import { Styles } from '../../styles';

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

const ChartLayout: React.StatelessComponent<ChartLayoutProps> = (props) => {
  const { chart, flowToggle, periodToggle } = props;
  return (
    <div style={styles.root}>
      <div style={styles.chartContainer}>{chart}</div>
      <div style={styles.toggles}>
        {flowToggle}
        {periodToggle}
      </div>
    </div>
  );
};

export default ChartLayout;
