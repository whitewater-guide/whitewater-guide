import CircularProgress from 'material-ui/CircularProgress';
import * as React from 'react';
import { Styles } from '../styles';
import spinnerHOC from '../ww-clients/utils/spinnerWhileLoading';

const styles: Styles = {
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
