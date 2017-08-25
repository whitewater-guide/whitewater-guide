import * as React from 'react';
import { Route } from 'react-router-dom';
import { Styles } from '../styles';

const styles: Styles = {
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

const UnauthorizedRoute: React.StatelessComponent = () => (
  <div style={styles.container}>
    <h1>403 Unauthorized</h1>
    <span>Bummer!</span>
  </div>
);

export default UnauthorizedRoute;
