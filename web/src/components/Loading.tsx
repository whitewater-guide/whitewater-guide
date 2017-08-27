import CircularProgress from 'material-ui/CircularProgress';
import * as React from 'react';
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

const Loading: React.StatelessComponent = () => (
  <div style={styles.container}>
    <CircularProgress />
  </div>
);

export default Loading;
