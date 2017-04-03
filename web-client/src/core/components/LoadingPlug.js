import React from 'react';
import { branch, renderComponent } from 'recompose';
import CircularProgress from 'material-ui/CircularProgress';

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

export const spinnerWhileLoading = isLoading => branch(
  isLoading,
  renderComponent(LoadingPlug),
);
