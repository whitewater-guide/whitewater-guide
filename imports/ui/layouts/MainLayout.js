import React, {Component, PropTypes} from 'react';
import {Toolbar, ToolbarSeparator} from 'material-ui/Toolbar';
import { indigo500 } from 'material-ui/styles/colors';
import UserMenu from '../components/UserMenu';
import {Link} from 'react-router';

export default class MainLayout extends Component {

  static propTypes = {
    left: PropTypes.element,
    toolbar: PropTypes.element,
    content: PropTypes.element,
  };
  
  render() {
    return (
      <div style={styles.root}>
        <div style={styles.leftCol}>
          <div style={styles.logo}>
            <Link to="/">Logo goes here</Link>
          </div>
          { this.props.left }
        </div>
        <div style={styles.rightCol}>
          <Toolbar style={styles.toolbar}>
            { this.props.toolbar }
            <div style={{flex: 1}}></div>
            <UserMenu/>
          </Toolbar>
          { this.props.content }
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
  leftCol: {
    width: 240,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: indigo500,
  },
  rightCol: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  logo: {
    alignSelf: 'stretch',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
  },
  toolbar: {
    minHeight: 56,
  },
}