import CircularProgress from '@material-ui/core/CircularProgress';
import React from 'react';
import { Styles } from '../styles';

const styles: Styles = {
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export const Loading: React.FC = () => (
  <div style={styles.container}>
    <CircularProgress />
  </div>
);
