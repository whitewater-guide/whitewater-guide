/* tslint:disable:no-var-requires*/
import { apolloErrorClear, ApolloErrorState } from '@whitewater-guide/clients';
import IconButton from 'material-ui/IconButton';
import Snackbar from 'material-ui/Snackbar';
import { grey100 } from 'material-ui/styles/colors';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../components';
import { UserMenu } from '../features/users';
import { RootState } from '../redux';
import { Styles } from '../styles';
import breadcrumbRoutes from './breadcrumbRoutes';
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
    backgroundColor: grey100,
  },
  toolbar: {
    height: 56,
    paddingRight: 32,
    alignItems: 'center',
    boxShadow:
      'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px',
    zIndex: 1500,
  },
};

interface Props {
  apolloError: ApolloErrorState;
  apolloErrorClear: () => any;
}

interface State {
  drawerOpen: boolean;
}

// Cannot be pure because of react-router update-blocking
class RootLayoutInternal extends React.Component<Props, State> {
  state: State = { drawerOpen: false };

  toggleDrawer = () => this.setState({ drawerOpen: !this.state.drawerOpen });
  onDrawerToggle = (drawerOpen: boolean) => this.setState({ drawerOpen });
  onSnackbarClose = () => this.props.apolloErrorClear();

  renderSnackbar = () => {
    const { short = '', full = '' } = this.props.apolloError;
    const action = (
      <CopyToClipboard text={full}>
        <span>copy</span>
      </CopyToClipboard>
    );
    return (
      <Snackbar
        action={action}
        open={!!short}
        message={short}
        autoHideDuration={7000}
        onRequestClose={this.onSnackbarClose}
      />
    );
  };

  render() {
    return (
      <div style={styles.root}>
        <Toolbar style={styles.toolbar}>
          <ToolbarGroup firstChild={true}>
            <IconButton
              iconClassName="material-icons"
              onClick={this.toggleDrawer}
            >
              menu
            </IconButton>
            <Link to="/">
              <img src={logo} alt="Logo" />
            </Link>
            <Breadcrumbs routes={breadcrumbRoutes} />
          </ToolbarGroup>
          <ToolbarGroup lastChild={true}>
            <UserMenu />
          </ToolbarGroup>
        </Toolbar>
        <ContentLayout />
        <Drawer isOpen={this.state.drawerOpen} onChange={this.onDrawerToggle} />
        {this.renderSnackbar()}
      </div>
    );
  }
}

export const RootLayout = connect(
  ({ apolloError }: RootState) => ({ apolloError }),
  { apolloErrorClear },
  undefined,
  { pure: false }, // Do not block react-router updates
)(RootLayoutInternal);
