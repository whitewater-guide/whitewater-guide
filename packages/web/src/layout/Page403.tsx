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

const Page403: React.StatelessComponent = () => (
  <Content style={styles.container}>
    <h1>403 Unauthorized</h1>
    <span>Bummer!</span>
  </Content>
);

export default Page403;