import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addNavigationHelpers } from 'react-navigation';
import { RootNavigator } from './routes';
import { Screen } from '../components';

class RootView extends Component {
  static propTypes = {
    nav: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    initialized: PropTypes.bool.isRequired,
  };

  static mapStateToProps = state => ({
    nav: state.persistent.nav,
    initialized: state.transient.app.initialized,
  });

  render() {
    if (!this.props.initialized) {
      return <Screen />;
    }
    const navigation = addNavigationHelpers({
      dispatch: this.props.dispatch,
      state: this.props.nav,
    });
    return (
      <RootNavigator navigation={navigation} />
    );
  }
}

export default connect(RootView.mapStateToProps)(RootView);
