import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View } from 'react-native';
import DrawerLayout from 'react-native-drawer-layout';
import { addNavigationHelpers } from 'react-navigation';
import { RootNavigator } from './routes';
import { GuideModal, Screen } from '../components';
import { toggleDrawer } from '../core/actions';
import Drawer from './Drawer';

class RootView extends Component {
  static propTypes = {
    nav: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    initialized: PropTypes.bool.isRequired,
    drawerOpen: PropTypes.bool.isRequired,
  };

  static mapStateToProps = state => ({
    nav: state.persistent.nav,
    initialized: state.transient.app.initialized,
    drawerOpen: state.transient.app.drawerOpen,
  });

  constructor(props) {
    super(props);
    this._drawer = null;
  }

  componentDidUpdate(prevProps) {
    if (!this._drawer) {
      return;
    }
    if (this.props.drawerOpen && !prevProps.drawerOpen) {
      this._drawer.openDrawer();
    } else if (!this.props.drawerOpen && prevProps.drawerOpen) {
      this._drawer.closeDrawer();
    }
  }

  onDrawerMounted = (drawer) => { this._drawer = drawer; };

  onDrawerClose = () => this.props.dispatch(toggleDrawer(false));

  renderDrawer = () => (<Drawer />);

  render() {
    if (!this.props.initialized) {
      return <Screen />;
    }
    const navigation = addNavigationHelpers({
      dispatch: this.props.dispatch,
      state: this.props.nav,
    });
    return (
      <DrawerLayout
        ref={this.onDrawerMounted}
        drawerBackgroundColor="white"
        drawerWidth={300}
        drawerLockMode="locked-closed"
        onDrawerClose={this.onDrawerClose}
        keyboardDismissMode="on-drag"
        statusBarBackgroundColor="white"
        renderNavigationView={this.renderDrawer}
      >
        <View style={StyleSheet.absoluteFill}>
          <RootNavigator navigation={navigation} />
          <GuideModal />
        </View>
      </DrawerLayout>
    );
  }
}

export default connect(RootView.mapStateToProps)(RootView);
