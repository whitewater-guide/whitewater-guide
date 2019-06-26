import { AuthProvider, AuthService } from '@whitewater-guide/clients';
import { WebAuthService } from '@whitewater-guide/clients/dist/web';
import ApolloClient from 'apollo-client';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { initApolloClient } from './apollo';
import { Loading } from './components';
import { API_HOST, FACEBOOK_APP_ID } from './environment';
import { history } from './history';
import { RootLayout } from './layout';
import { store } from './redux';
import { theme } from './styles';
import { SentryRouterBreadcrumbs } from './utils';

interface State {
  ready: boolean;
}

class App extends React.PureComponent {
  private _client!: ApolloClient<any>;
  private _auth!: AuthService;

  readonly state: State = { ready: false };

  async componentWillMount() {
    this._auth = new WebAuthService(
      API_HOST,
      FACEBOOK_APP_ID,
      this.onSignIn,
      this.onSignOut,
    );
    this._client = initApolloClient(this._auth);
    await this._auth.init();
    this.setState({ ready: true });
  }

  onSignIn = async () => {
    await this._client.resetStore();
  };

  onSignOut = async () => {
    history.replace('/regions');
    await this._client.resetStore();
  };

  render() {
    const { ready } = this.state;
    return (
      <MuiThemeProvider muiTheme={theme}>
        <Provider store={store}>
          <ApolloProvider client={this._client}>
            {ready ? (
              <AuthProvider service={this._auth}>
                <BrowserRouter>
                  <SentryRouterBreadcrumbs />
                  <RootLayout />
                </BrowserRouter>
              </AuthProvider>
            ) : (
              <Loading />
            )}
          </ApolloProvider>
        </Provider>
      </MuiThemeProvider>
    );
  }
}

export default App;
