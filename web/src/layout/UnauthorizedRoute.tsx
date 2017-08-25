import * as React from 'react';
import { Route } from 'react-router-dom';
import { Styles } from '../styles';
import { Content } from './Content';

const styles: Styles = {
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

const UnauthorizedRoute: React.StatelessComponent = () => (
  <Content style={styles.container}>
    <h1>403 Unauthorized</h1>
    <span>Bummer!</span>
  </Content>
);

export default UnauthorizedRoute;
