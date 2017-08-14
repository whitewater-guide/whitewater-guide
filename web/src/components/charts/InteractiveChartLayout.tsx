import * as React from 'react';
import { Styles } from '../../styles';
import { ChartLayoutProps } from '../../ww-clients/features/charts';

const styles: Styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

const InteractiveChart: React.StatelessComponent<ChartLayoutProps> = ({ chart, flowToggle, periodToggle }) => (
  <div style={styles.container}>
    <div style={styles.buttonContainer}>
      {periodToggle}
      {flowToggle}
    </div>
    {chart}
  </div>
);

export default InteractiveChart;
