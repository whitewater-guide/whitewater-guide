import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import * as React from 'react';
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter } from 'react-router-dom';
import { apolloClient } from '../core/config/configureApollo';
import configureStore from '../core/config/configureStore';
import { RootLayout } from '../layouts';
import theme from './styles/theme';

const store = configureStore();

export default () => (
  <MuiThemeProvider muiTheme={theme}>
    <ApolloProvider store={store} client={apolloClient}>
      <BrowserRouter>
        <RootLayout />
      </BrowserRouter>
    </ApolloProvider>
  </MuiThemeProvider>
);
