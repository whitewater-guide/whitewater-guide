import ApolloClient from 'apollo-client';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { Provider } from 'react-redux';
import { Store, Unsubscribe } from 'redux';
import { Screen } from './components';
import { getApolloClient } from './core/apollo';
import configMisc from './core/config/configMisc';
import { RootState } from './core/reducers';
import { RootNavigator } from './core/routes';
import configureStore from './core/store/configureStore';

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

  render() {
    if (this.store && this.state.initialized) {
      return (
        <Provider store={this.store}>
          <ApolloProvider client={this.apolloClient}>
            <RootNavigator />
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
