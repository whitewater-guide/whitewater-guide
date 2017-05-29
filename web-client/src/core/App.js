import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import theme from './styles/theme';
import FacebookProvider from './FacebookProvider';
import { RootLayout } from './layouts';
import { apolloClient } from '../core/config/configureApollo';
import configureStore from '../core/config/configureStore';

const store = configureStore();

export default () => (
  <MuiThemeProvider muiTheme={theme}>
    <FacebookProvider appId={process.env.facebook.appId}>
      <ApolloProvider store={store} client={apolloClient}>
        <BrowserRouter>
          <RootLayout />
        </BrowserRouter>
      </ApolloProvider>
    </FacebookProvider>
  </MuiThemeProvider>
);
