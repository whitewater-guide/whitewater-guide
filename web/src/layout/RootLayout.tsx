/* tslint:disable:no-var-requires*/
import IconButton from 'material-ui/IconButton';
import { grey100 } from 'material-ui/styles/colors';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { UserMenu } from '../features/users';
import { Styles } from '../styles';
import ContentLayout from './ContentLayout';
import { Drawer } from './drawer';

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
    height: 56,
    alignItems: 'center',
    boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px',
    zIndex: 1500,
  },

};

interface State {
  drawerOpen: boolean;
}

export class RootLayout extends React.PureComponent<{}, State> {
  state: State = { drawerOpen: false };

  toggleDrawer = () => this.setState({ drawerOpen: !this.state.drawerOpen });
  onDrawerToggle = (drawerOpen: boolean) => this.setState({ drawerOpen });

  render() {
    return (
      <div style={styles.root}>
        <Toolbar style={styles.toolbar}>
          <ToolbarGroup firstChild>
            <IconButton iconClassName="material-icons" onClick={this.toggleDrawer}>menu</IconButton>
            <Link to="/"><img src={logo} alt="Logo" /></Link>
          </ToolbarGroup>
          <ToolbarGroup lastChild>
            <UserMenu />
          </ToolbarGroup>
        </Toolbar>
        <div style={styles.main}>
          <ContentLayout/>
        </div>
        <Drawer isOpen={this.state.drawerOpen} onChange={this.onDrawerToggle} />
      </div>
    );
  }
}
