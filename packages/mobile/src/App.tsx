import ApolloClient from 'apollo-client';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { Provider } from 'react-redux';
import { Store, Unsubscribe } from 'redux';
import { Screen, SplashScreen } from './components';
import { getApolloClient } from './core/apollo';
import configMisc from './core/config/configMisc';
import { RootState } from './core/reducers';
import configureStore from './core/store/configureStore';
import RootNavigator from './RootNavigator';
import { MyProfileProvider } from './ww-clients/features/users';

configMisc();

interface State {
  initialized: boolean;
}

class App extends React.Component<{}, State> {
  state: State = { initialized: false };
  store?: Store<RootState>;
  apolloClient?: ApolloClient<any>;
  storeSubscription?: Unsubscribe;

  async componentDidMount() {
    this.store = await configureStore();
    this.apolloClient = getApolloClient(this.store.dispatch);
    const initialized = this.store.getState().app.initialized;
    if (!initialized) {
      this.storeSubscription = this.store.subscribe(this.listenForInitialize);
    }
    this.setState({ initialized });
  }

  shouldComponentUpdate(nextProps: any, nextState: State) {
    return !this.state.initialized && nextState.initialized;
  }

  listenForInitialize = () => {
    const initialized = this.store.getState().app.initialized;
    this.setState({ initialized });
  };

  renderLoading = () => <SplashScreen />;

  render() {
    if (this.store && this.state.initialized) {
      return (
        <Provider store={this.store}>
          <ApolloProvider client={this.apolloClient}>
            <MyProfileProvider renderLoading={this.renderLoading}>
              <RootNavigator />
            </MyProfileProvider>
          </ApolloProvider>
        </Provider>
      );
    }
    return (
      <Screen />
    );
  }
}

export default App;
