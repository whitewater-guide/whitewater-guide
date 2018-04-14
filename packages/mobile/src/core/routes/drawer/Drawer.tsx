import React from 'react';
import { StyleSheet, View } from 'react-native';
import DrawerLayout from 'react-native-drawer-layout';
import { connect } from 'react-redux';
import theme from '../../../theme';
import { toggleDrawer } from '../../actions';
import { RootState } from '../../reducers';
import DrawerSidebar from './DrawerSidebar';
import { WithToggle } from './types';

interface StateProps {
  drawerOpen: boolean;
}

type DispatchProps = WithToggle;

type Props = StateProps & DispatchProps;

class DrawerView extends React.PureComponent<Props> {

  drawer?: DrawerLayout;

  componentDidUpdate(prevProps: Props) {
    if (!this.drawer) {
      return;
    }
    if (this.props.drawerOpen && !prevProps.drawerOpen) {
      this.drawer.openDrawer();
    } else if (!this.props.drawerOpen && prevProps.drawerOpen) {
      this.drawer.closeDrawer();
    }
  }

  onDrawerMounted = (drawer: DrawerLayout) => {
    this.drawer = drawer;
  };

  onDrawerClose = () => this.props.toggleDrawer(false);

  renderDrawer = () => (<DrawerSidebar toggleDrawer={this.props.toggleDrawer} />);

  render() {
    return (
      <DrawerLayout
        ref={this.onDrawerMounted}
        drawerBackgroundColor={theme.colors.primaryBackground}
        drawerWidth={300}
        drawerLockMode="locked-closed"
        onDrawerClose={this.onDrawerClose}
        keyboardDismissMode="on-drag"
        statusBarBackgroundColor="white"
        renderNavigationView={this.renderDrawer}
        drawerPosition="left"
      >
        <View style={StyleSheet.absoluteFill}>
          {this.props.children}
        </View>
      </DrawerLayout>
    );
  }
}

export const Drawer: React.ComponentType = connect<StateProps, DispatchProps>(
  ({ app }: RootState) => ({ drawerOpen: app.drawerOpen }),
  { toggleDrawer },
)(DrawerView);
