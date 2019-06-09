import { AuthProvider } from '@whitewater-guide/clients';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { client } from './apollo';
import { webAuthService } from './auth';
import { RootLayout } from './layout';
import { store } from './redux';
import { theme } from './styles';

export default class App extends React.PureComponent {
  async componentWillMount() {
    await webAuthService.init();
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={theme}>
        <Provider store={store}>
          <ApolloProvider client={client}>
            <AuthProvider service={webAuthService}>
              <BrowserRouter>
                <RootLayout />
              </BrowserRouter>
            </AuthProvider>
          </ApolloProvider>
        </Provider>
      </MuiThemeProvider>
    );
  }
}
