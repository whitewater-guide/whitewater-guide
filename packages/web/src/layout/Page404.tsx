import React from 'react';
import { Content } from '../components';
import { Styles } from '../styles';

const styles: Styles = {
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

const Page404: React.StatelessComponent = () => (
  <Content style={styles.container}>
    <h1>404 Not found</h1>
    <span>Oops!</span>
  </Content>
);

export default Page404;
