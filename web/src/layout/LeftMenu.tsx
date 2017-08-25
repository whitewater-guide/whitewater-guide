import Paper from 'material-ui/Paper';
import * as React from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import { Styles } from '../styles';

const styles: Styles = {
  leftCol: {
    width: 240,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
  },
  logo: {
    alignSelf: 'stretch',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
  },
};

const LeftMenu: React.StatelessComponent = () => (
  <Paper style={styles.leftCol}>
  </Paper>
);

export default LeftMenu;
