import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import { default as spinnerHOC } from '../../commons/utils/spinnerWhileLoading';

const styles = {
  container: {
    display: 'flex',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export const LoadingPlug = () => (
  <div style={styles.container}>
    <CircularProgress />
  </div>
);

export const spinnerWhileLoading = isLoading => spinnerHOC(isLoading, LoadingPlug);
