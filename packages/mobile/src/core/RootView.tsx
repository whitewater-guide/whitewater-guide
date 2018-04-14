import React from 'react';
import { addNavigationHelpers, NavigationState } from 'react-navigation';
import { createReduxBoundAddListener } from 'react-navigation-redux-helpers';
import { connect } from 'react-redux';
import { Screen } from '../components';
import { RootState } from './reducers';
import { RootNavigator } from './routes';

interface StateProps {
  nav: NavigationState;
  initialized: boolean;
}

interface DispatchProps {
  dispatch: any;
}

let _addListener: any;
const getAddListener = () => {
  if (!_addListener) {
    _addListener = createReduxBoundAddListener('root');
  }
  return _addListener;
};

const RootView: React.StatelessComponent<StateProps & DispatchProps> = ({ nav, dispatch, initialized }) => {
  const navigation = addNavigationHelpers({ dispatch, state: nav, addListener: getAddListener() });
  if (!initialized) {
    return <Screen />;
  }
  return (
    <RootNavigator navigation={navigation} />
  );
};

const mapStateToProps = (state: RootState): StateProps => ({
  nav: state.nav,
  initialized: state.app.initialized,
});

export default connect<StateProps, DispatchProps, {}, RootState>(mapStateToProps)(RootView);
