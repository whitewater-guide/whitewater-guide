import React from 'react';
import { Styles } from '../../styles';
import { ChartLayoutProps } from '../../ww-clients/features/charts';

const styles: Styles = {
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  toggles: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
};

const ChartLayout: React.StatelessComponent<ChartLayoutProps> = (props) => {
  const { chart, flowToggle, periodToggle } = props;
  return (
    <div style={styles.root}>
      {chart}
      <div style={styles.toggles}>
        {flowToggle}
        {periodToggle}
      </div>
    </div>
  );
};

export default ChartLayout;
