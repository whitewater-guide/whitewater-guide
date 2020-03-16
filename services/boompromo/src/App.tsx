import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { AuthService } from '@whitewater-guide/clients';
import { WebAuthService } from '@whitewater-guide/clients/dist/web';
import { ApolloClient } from 'apollo-client';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { initApolloClient } from './apollo';
import { API_HOST, FACEBOOK_APP_ID } from './environment';
import { RootLayout } from './layout';
import { theme } from './theme';

class App extends React.PureComponent {
  private readonly _auth: AuthService;
  private readonly _apollo: ApolloClient<any>;

  constructor(props: any) {
    super(props);
    this._auth = new WebAuthService(API_HOST, FACEBOOK_APP_ID);
    this._auth.on('sign-in', this.resetApolloStore);
    this._auth.on('sign-out', this.resetApolloStore);
    this._apollo = initApolloClient(this._auth);
  }

  componentWillUnmount() {
    this._auth.off('sign-in');
    this._auth.off('sign-out');
  }

  resetApolloStore = async () => {
    await this._apollo.resetStore();
  };

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <ApolloProvider client={this._apollo}>
          <RootLayout service={this._auth} />
        </ApolloProvider>
      </MuiThemeProvider>
    );
  }
}

export default App;
