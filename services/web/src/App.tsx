import { MyProfileProvider } from '@whitewater-guide/clients';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Store } from 'redux';
import { Persistor } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { client, refreshJWT } from './apollo';
import { Loading } from './components';
import { RootLayout } from './layout';
import { configureStore } from './redux';
import { theme } from './styles';

interface State {
  store?: Store;
  persistor?: Persistor;
  isRefreshingJwt: boolean;
}

export default class App extends React.PureComponent<{}, State> {
  state: State = { isRefreshingJwt: true };

  async componentWillMount() {
    const [{ store, persistor }] = await Promise.all([
      configureStore(),
      refreshJWT().catch(),
    ]);

    this.setState({ store, persistor, isRefreshingJwt: false });
  }

  renderLoading = () => <Loading />;

  render() {
    const { store, persistor, isRefreshingJwt } = this.state;
    if (isRefreshingJwt) {
      return (
        <MuiThemeProvider muiTheme={theme}>
          {this.renderLoading()}
        </MuiThemeProvider>
      );
    }
    if (store && persistor) {
      return (
        <MuiThemeProvider muiTheme={theme}>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <ApolloProvider client={client}>
                <MyProfileProvider renderLoading={this.renderLoading}>
                  <BrowserRouter>
                    <RootLayout />
                  </BrowserRouter>
                </MyProfileProvider>
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
