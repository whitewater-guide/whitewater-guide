import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import * as React from 'react';
import { ApolloProvider } from 'react-apollo';
import { Provider, Store } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Persistor } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { getApolloClient } from './apollo';
import { Loading } from './components';
import { RootLayout } from './layout';
import { configureStore, RootState } from './store';
import { theme } from './styles';

interface State {
  store?: Store<RootState>;
  persistor?: Persistor;
}

export default class App extends React.PureComponent<{}, State> {
  state: State = {};

  async componentDidMount() {
    const state = await configureStore();
    this.setState(state);
  }

  render() {
    const { store, persistor } = this.state;
    if (store && persistor) {
      const apolloClient = getApolloClient(store.dispatch);
      return (
        <MuiThemeProvider muiTheme={theme}>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <ApolloProvider client={apolloClient}>
                <BrowserRouter>
                  <RootLayout />
                </BrowserRouter>
              </ApolloProvider>
            </PersistGate>
          </Provider>
        </MuiThemeProvider>
      );
    }
    return (
      <MuiThemeProvider muiTheme={theme}>
        <Loading />
      </MuiThemeProvider>
    );
  }
}
