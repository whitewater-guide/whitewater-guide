import React, {Component, PropTypes} from 'react';
import {Toolbar} from 'material-ui/Toolbar';
import {UserMenu} from '../../features/users';
import {Breadcrumbs} from '../components';
import {ContentLayout} from './ContentLayout';
import {LeftMenu} from "./LeftMenu";

export class RootLayout extends Component {

  render() {
    return (
      <div style={styles.root}>
        <LeftMenu/>
        <div style={styles.rightCol}>
          <Toolbar style={styles.toolbar}>
            <Breadcrumbs />
            <div style={{flex: 1}}></div>
            <UserMenu/>
          </Toolbar>
          <div style={styles.content}>
            <ContentLayout/>
          </div>
        </div>
      </div>
    );
  }
}

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
};