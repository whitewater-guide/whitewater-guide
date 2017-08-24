import { Toolbar } from 'material-ui/Toolbar';
import * as React from 'react';
import { Styles } from '../styles';
import { ContentLayout } from './ContentLayout';
import { LeftMenu } from './LeftMenu';

const styles: Styles = {
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
        <div style={styles.spacer}/>
      </Toolbar>
      <div style={styles.content}>
        <ContentLayout/>
      </div>
    </div>
  </div>
);
