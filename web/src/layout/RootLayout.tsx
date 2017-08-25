/* tslint:disable:no-var-requires*/
import { grey100 } from 'material-ui/styles/colors';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { UserMenu } from '../features/users';
import { Styles } from '../styles';
import { ContentLayout } from './ContentLayout';
import LeftMenu from './LeftMenu';

const logo = require('./logo.png');

const styles: Styles = {
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'stretch',
    flexDirection: 'column',
  },
  main: {
    flex: 1,
    display: 'flex',
    overflowY: 'auto',
    backgroundColor: grey100,
  },
  toolbar: {
    minHeight: 56,
    alignItems: 'center',
    boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px',
    zIndex: 1100,
  },
};

export const RootLayout: React.StatelessComponent = () => (
  <div style={styles.root}>
    <Toolbar style={styles.toolbar}>
      <ToolbarGroup firstChild>
        <Link to="/"><img src={logo} alt="Logo" /></Link>
      </ToolbarGroup>
      <ToolbarGroup lastChild>
        <UserMenu />
      </ToolbarGroup>
    </Toolbar>
    <div style={styles.main}>
      <LeftMenu/>
      <ContentLayout/>
    </div>
  </div>
);
