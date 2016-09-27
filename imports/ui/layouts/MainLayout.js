import React, {Component} from 'react';
import {Toolbar, ToolbarSeparator} from 'material-ui/Toolbar';
import UserMenu from '../components/UserMenu';

export default class MainLayout extends Component {
  
  render() {
    return (
      <div style={styles.root}>
        <Toolbar>
          <ToolbarSeparator />
          <UserMenu/>
        </Toolbar>
        {this.props.children}
      </div>
    );
  }
}

const styles = {
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
}