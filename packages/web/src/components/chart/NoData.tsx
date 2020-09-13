import React from 'react';

import { Styles } from '../../styles';

const styles: Styles = {
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

interface Props {
  hasGauge?: boolean;
}

const NoData: React.FC<Props> = ({ hasGauge }) => {
  return (
    <div style={styles.container}>
      {hasGauge
        ? ' There is no fresh data'
        : 'There is no gauge for this section'}
    </div>
  );
};

export default NoData;
