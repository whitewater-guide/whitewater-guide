import { Toolbar } from 'material-ui/Toolbar';
import * as React from 'react';
import { UserMenu } from '../../features/users';
import { UserMenu } from '../features/users';
import { Breadcrumbs } from './Breadcrumbs';
import { ContentLayout } from './ContentLayout';
import { LeftMenu } from './LeftMenu';

const styles = {
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'stretch',
  },
  rightCol: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  toolbar: {
    minHeight: 56,
    alignItems: 'center',
  },
  content: {
    display: 'flex',
    flex: 1,
    overflowY: 'auto',
  },
  spacer: {
    flex: 1,
  },
};

export const RootLayout: React.StatelessComponent = () => (
  <div style={styles.root}>
    <LeftMenu/>
    <div style={styles.rightCol}>
      <Toolbar style={styles.toolbar}>
        <Breadcrumbs />
        <div style={styles.spacer}/>
        <UserMenu/>
      </Toolbar>
      <div style={styles.content}>
        <ContentLayout/>
      </div>
    </div>
  </div>
);
