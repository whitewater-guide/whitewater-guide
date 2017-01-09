import React, {Component, PropTypes} from 'react';
import {Toolbar} from 'material-ui/Toolbar';
import { indigo500 } from 'material-ui/styles/colors';
import UserMenu from '../components/UserMenu';
import Breadcrumbs from '../components/Breadcrumbs';
import FlatLinkButton from '../components/FlatLinkButton';
import {Link} from 'react-router';
import {withRouter} from 'react-router';

class MainLayout extends Component {

  static propTypes = {
    left: PropTypes.element,
    toolbar: PropTypes.element,
    content: PropTypes.element,
    routes: PropTypes.array,
    params: PropTypes.object,
  };
  
  render() {
    return (
      <div style={styles.root}>
        <div style={styles.leftCol}>
          <div style={styles.logo}>
            <Link to="/">Logo goes here</Link>
          </div>
          <FlatLinkButton to="/sources" label="Sources" secondary={true}/>
          <FlatLinkButton to="/regions" label="Regions" secondary={true}/>
          <FlatLinkButton to="/rivers" label="Rivers" secondary={true}/>
          <FlatLinkButton to="/sections" label="Sections" secondary={true}/>
          <FlatLinkButton to="/files" label="Images" secondary={true}/>
          { this.props.left }
        </div>
        <div style={styles.rightCol}>
          <Toolbar style={styles.toolbar}>
            <Breadcrumbs routes={this.props.routes} params={this.props.params}/>
            { this.props.toolbar }
            <div style={{flex: 1}}></div>
            <UserMenu/>
          </Toolbar>
          <div style={styles.content}>
            { this.props.content }
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
  content: {
    display: 'flex',
    flex: 1,
    overflowY: 'auto',
  },
};

export default withRouter(MainLayout);