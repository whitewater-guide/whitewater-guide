import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider } from '@material-ui/core/styles';
import {
  AuthProvider,
  AuthService,
  TagsProvider,
} from '@whitewater-guide/clients';
import { WebAuthService } from '@whitewater-guide/clients/dist/web';
import ApolloClient from 'apollo-client';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter } from 'react-router-dom';
import { initApolloClient } from './apollo';
import { Loading } from './components';
import { API_HOST, FACEBOOK_APP_ID } from './environment';
import { history } from './history';
import { RootLayout } from './layout';
import { MY_PROFILE_QUERY } from './myProfile.query';
import { theme } from './styles';
import { SentryRouterBreadcrumbs } from './utils';

class App extends React.PureComponent {
  private _client!: ApolloClient<any>;
  private _auth!: AuthService;

  async componentWillMount() {
    this._auth = new WebAuthService(
      API_HOST,
      FACEBOOK_APP_ID,
      this.onSignIn,
      this.onSignOut,
    );
    this._client = initApolloClient(this._auth);
  }

  onSignIn = async () => {
    await this._client.resetStore();
  };

  onSignOut = async () => {
    history.replace('/regions');
    await this._client.resetStore();
  };

  render() {
    return (
      <React.Fragment>
        <CssBaseline />
        <MuiThemeProvider theme={theme}>
          <ApolloProvider client={this._client}>
            <AuthProvider
              service={this._auth}
              renderInitializing={<Loading />}
              query={MY_PROFILE_QUERY}
            >
              <TagsProvider>
                <BrowserRouter>
                  <SentryRouterBreadcrumbs />
                  <RootLayout />
                </BrowserRouter>
              </TagsProvider>
            </AuthProvider>
          </ApolloProvider>
        </MuiThemeProvider>
      </React.Fragment>
    );
  }
}

export default App;
